#!/usr/bin/env bash
set -euo pipefail

: "${RESOURCE_GROUP:=synapse-governance-rg}"
: "${LOCATION:=eastus}"
: "${DEPLOYMENT_NAME:=synapse-governance-foundation}"
: "${ARM_TEMPLATE:=infra/azure/arm/governance-foundation.json}"
: "${AKS_CLUSTER:=synapse-aks}"
: "${K8S_MANIFEST:=infra/k8s/governance-api.yaml}"

if ! command -v az >/dev/null 2>&1; then
  echo "Azure CLI is required" >&2
  exit 1
fi
if ! command -v kubectl >/dev/null 2>&1; then
  echo "kubectl is required" >&2
  exit 1
fi

echo "[1/5] Ensuring resource group"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" >/dev/null

echo "[2/5] Deploying ARM foundation"
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$DEPLOYMENT_NAME" \
  --template-file "$ARM_TEMPLATE" >/dev/null

echo "[3/5] Ensuring AKS cluster exists (${AKS_CLUSTER})"
if ! az aks show --resource-group "$RESOURCE_GROUP" --name "$AKS_CLUSTER" >/dev/null 2>&1; then
  az aks create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$AKS_CLUSTER" \
    --node-count 2 \
    --node-vm-size Standard_D2s_v5 \
    --enable-managed-identity \
    --generate-ssh-keys >/dev/null
fi

echo "[4/5] Pulling AKS credentials"
az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$AKS_CLUSTER" --overwrite-existing

echo "[5/5] Applying governance API manifest"
kubectl apply -f "$K8S_MANIFEST"
