# MASTER 2035 REFERENCE

This document is the canonical seed reference for future architecture work.

## Governing ADR

- **ADR-0001:** `docs/adr/ADR-0001-baseline-freeze.md`

## Baseline status

- baseline freeze recorded: yes
- backend architecture accepted: yes
- primary operating surface accepted: yes
- future merge guardrails defined: yes
- ADR-style acceptance complete: yes

## Canonical components

- SYNAPSE / FORNIX OS
- ATRIUM as primary operating surface
- edge + core node split
- local-first, proof-first, bounded-authority model
- API gateway + CAS ingest + NDJSON spine
- PostgreSQL/pgvector + Neo4j model split
- Docker Compose dev/prod topology

All future major changes must be ADR-traceable and either reference or supersede ADR-0001.

Merges to `master` are expected to pass ADR-0001 freeze/approval checks, with deviations requiring a superseding ADR.

## Deployment-ready support docs

- `docs/DEPLOYMENT_READINESS.md`
- `docs/frontend/EXPERT_ROLES_TABLE.md`
- `docs/data/expert_roles.sample.json`
- `docs/data/canonical_expert_roles.json`
- `ARCHITECTURE_SPEC.md`
- `backend/app/services/role_ingestion_service.py`
- `backend/app/api/routes/governance.py`
- `docs/planning/ROLE_TASK_MATRIX.md`
- `docs/planning/CURRICULUM_COST_MODEL.md`
- `docs/planning/WEB_PRESENCE_PLAN.md`
- `docs/appsheet/APPSHEET_SYSTEM_BLUEPRINT.md`
- `docs/appsheet/DEPLOYMENT_READINESS_CHECKLIST.md`
- `docs/appsheet/DATA_KEYS_AND_SECURITY.md`
- `docs/appsheet/APPSHEET_SETTINGS_PROFILE.md`
- `docs/appsheet/ROLE_PREVIEW_TEST_MATRIX.md`
- `docs/deployment/INFRA_TRANSLATION_GUIDE.md`
- `infra/k8s/governance-api.yaml`
- `infra/aws/cloudformation/governance-foundation.yaml`
- `infra/gcp/terraform/main.tf`
- `infra/azure/arm/governance-foundation.json`
- `docs/visual/VISUAL_REFERENCE_MAP.md`
- `docs/frontend/SYNAPSE_VISUAL_TOKENS.md`
