#!/usr/bin/env bash
set -euo pipefail

# Universal orchestrator for SYNAPSE/FORNIX governance runtime
# Requires cloud credentials and CLIs for selected target provider.

: "${TARGET_CLOUD:=aws}"    # aws|gcp|azure
: "${RUN_SECRET_BOOTSTRAP:=true}"
: "${K8S_MANIFEST:=infra/k8s/governance-api.yaml}"

echo "[INIT] Target cloud: ${TARGET_CLOUD}"

if [[ "${RUN_SECRET_BOOTSTRAP}" == "true" ]]; then
  echo "[SECRETS] Bootstrapping governance-secrets"
  bash scripts/deploy/render_k8s_secret.sh
fi

case "${TARGET_CLOUD}" in
  aws)
    echo "[CLOUD] Running AWS deployment path"
    bash scripts/deploy/deploy_aws.sh
    ;;
  gcp)
    echo "[CLOUD] Running GCP deployment path"
    bash scripts/deploy/deploy_gcp.sh
    ;;
  azure)
    echo "[CLOUD] Running Azure deployment path"
    bash scripts/deploy/deploy_azure.sh
    ;;
  *)
    echo "Unsupported TARGET_CLOUD=${TARGET_CLOUD} (expected aws|gcp|azure)" >&2
    exit 1
    ;;
esac

echo "[VERIFY] Verifying rollout"
kubectl apply -f "${K8S_MANIFEST}"
kubectl rollout status deployment/governance-api --timeout=180s
kubectl get deploy,svc,pods -l app=governance-api

echo "[DONE] Multi-cloud deployment workflow complete"
