#!/usr/bin/env bash
set -euo pipefail

: "${PROJECT_ID:?Set PROJECT_ID}"
: "${REGION:=us-central1}"
: "${TF_DIR:=infra/gcp/terraform}"
: "${CLUSTER_NAME:=synapse-gke}"
: "${K8S_MANIFEST:=infra/k8s/governance-api.yaml}"

if ! command -v terraform >/dev/null 2>&1; then
  echo "terraform is required" >&2
  exit 1
fi
if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud CLI is required" >&2
  exit 1
fi
if ! command -v kubectl >/dev/null 2>&1; then
  echo "kubectl is required" >&2
  exit 1
fi

echo "[1/4] Applying Terraform foundation"
terraform -chdir="$TF_DIR" init
terraform -chdir="$TF_DIR" apply -auto-approve \
  -var "project_id=$PROJECT_ID" \
  -var "region=$REGION"

echo "[2/4] Pulling GKE credentials"
gcloud container clusters get-credentials "$CLUSTER_NAME" \
  --region "$REGION" --project "$PROJECT_ID"

echo "[3/4] Applying governance API manifest"
kubectl apply -f "$K8S_MANIFEST"

echo "[4/4] Current deployment status"
kubectl rollout status deployment/governance-api --timeout=120s
