# Infrastructure Translation Guide

This guide translates `infra/k8s/governance-api.yaml` into concrete cloud infrastructure execution on AWS, GCP, and Azure so the same workload can be deployed onto managed Kubernetes clusters backed by physical cloud resources.

## Runtime anchor

- Kubernetes runtime manifest: `infra/k8s/governance-api.yaml`
- Required runtime secret: `governance-secrets`
- Secret rendering helper: `scripts/deploy/render_k8s_secret.sh`

## Provider-specific infrastructure packs

### AWS (CloudFormation + EKS)

- Foundation template: `infra/aws/cloudformation/governance-foundation.yaml`
- Deploy script: `scripts/deploy/deploy_aws.sh`

Example:

```bash
export AWS_REGION=us-east-1
bash scripts/deploy/deploy_aws.sh
```

The script performs: CloudFormation deploy → EKS creation (if absent) → kubeconfig update → k8s apply.

### GCP (Terraform + GKE)

- Terraform files: `infra/gcp/terraform/main.tf`, `infra/gcp/terraform/variables.tf`
- Deploy script: `scripts/deploy/deploy_gcp.sh`

Example:

```bash
export PROJECT_ID=<your-gcp-project>
export REGION=us-central1
bash scripts/deploy/deploy_gcp.sh
```

The script performs: Terraform apply → GKE credential pull → k8s apply → rollout check.

### Azure (ARM + AKS)

- ARM template: `infra/azure/arm/governance-foundation.json`
- Deploy script: `scripts/deploy/deploy_azure.sh`

Example:

```bash
export RESOURCE_GROUP=synapse-governance-rg
export LOCATION=eastus
bash scripts/deploy/deploy_azure.sh
```

The script performs: RG create → ARM deploy → AKS create (if absent) → credential pull → k8s apply.

## Shared secret bootstrap (all clouds)

Before applying workloads, create the runtime secret:

```bash
export DATABASE_URL='postgresql+psycopg2://...'
export NEO4J_URI='neo4j+s://...'
export NEO4J_USER='neo4j'
export NEO4J_PASSWORD='...'
bash scripts/deploy/render_k8s_secret.sh
```

## Post-deploy verification

```bash
kubectl get deploy,svc,pods -l app=governance-api
kubectl rollout status deployment/governance-api --timeout=120s
```

## Recommended next implementation

1. Add managed PostgreSQL modules per cloud (RDS / Cloud SQL / Azure Database for PostgreSQL).
2. Add provider-native secret stores and CSI drivers.
3. Add ingress + TLS and autoscaling policy.
4. Wire CI/CD to run the deployment scripts per environment.
