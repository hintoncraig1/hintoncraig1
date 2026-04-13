# Infrastructure Translation Guide

This guide anchors Kubernetes runtime manifests to physical cloud infrastructure definitions.

## Kubernetes runtime anchor

- Runtime manifest: `infra/k8s/governance-api.yaml`
- Deploys the `governance-api` workload with secret-based DB and Neo4j wiring.

## AWS (CloudFormation)

- Template: `infra/aws/cloudformation/governance-foundation.yaml`
- Provides starter VPC, subnet, and EKS cluster role resources.
- Extend with EKS cluster/node groups, RDS Postgres, and Secrets Manager for production.

## GCP (Terraform)

- Terraform root: `infra/gcp/terraform/`
- Provisions VPC/subnet + GKE cluster/node pool.
- Extend with Cloud SQL (Postgres), Secret Manager, and workload identity bindings.

## Azure (ARM)

- ARM template: `infra/azure/arm/governance-foundation.json`
- Provisions VNet and AKS-ready subnet foundation.
- Extend with AKS cluster, Azure Database for PostgreSQL, Key Vault, and managed identity.

## Deployment sequence

1. Provision infrastructure (AWS/GCP/Azure).
2. Create secrets in provider-native vault.
3. Apply Kubernetes manifests.
4. Run application health checks and smoke tests.
5. Promote to production after deployment check pass.
