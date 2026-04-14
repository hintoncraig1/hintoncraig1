#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:=us-east-1}"
: "${STACK_NAME:=synapse-governance-foundation}"
: "${TEMPLATE_FILE:=infra/aws/cloudformation/governance-foundation.yaml}"
: "${K8S_MANIFEST:=infra/k8s/governance-api.yaml}"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required" >&2
  exit 1
fi
if ! command -v kubectl >/dev/null 2>&1; then
  echo "kubectl is required" >&2
  exit 1
fi
if ! command -v eksctl >/dev/null 2>&1; then
  echo "eksctl is required for cluster bootstrap" >&2
  exit 1
fi

echo "[1/5] Deploying CloudFormation foundation stack"
aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name "$STACK_NAME" \
  --template-file "$TEMPLATE_FILE" \
  --capabilities CAPABILITY_NAMED_IAM

CLUSTER_NAME=$(aws cloudformation describe-stacks \
  --region "$AWS_REGION" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='EksClusterName'].OutputValue" \
  --output text)

SUBNET_ID=$(aws cloudformation describe-stacks \
  --region "$AWS_REGION" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='PublicSubnetId'].OutputValue" \
  --output text)

if [[ -z "$CLUSTER_NAME" || "$CLUSTER_NAME" == "None" ]]; then
  echo "EksClusterName output missing from stack" >&2
  exit 1
fi

echo "[2/5] Ensuring EKS cluster exists (${CLUSTER_NAME})"
if ! aws eks describe-cluster --region "$AWS_REGION" --name "$CLUSTER_NAME" >/dev/null 2>&1; then
  eksctl create cluster \
    --region "$AWS_REGION" \
    --name "$CLUSTER_NAME" \
    --vpc-public-subnets "$SUBNET_ID" \
    --nodes 2 \
    --node-type t3.medium \
    --managed
fi

echo "[3/5] Updating kubeconfig"
aws eks update-kubeconfig --region "$AWS_REGION" --name "$CLUSTER_NAME"

echo "[4/5] Applying governance API manifest"
kubectl apply -f "$K8S_MANIFEST"

echo "[5/5] Current services"
kubectl get svc governance-api
