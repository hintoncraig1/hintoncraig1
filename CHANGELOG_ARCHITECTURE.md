# Architecture Changelog

## 2026-04-13

### Added

- Accepted and froze baseline architecture under ADR-0001.
- Established canonical 2035 reference seed and governance rules.
- Declared change-control boundaries for no-ADR and ADR-required updates.
- Added explicit pre-merge `master` approval gate language in ADR-0001.
- Added deployment-readiness documentation covering architecture, code, cost lanes, and pedagogical progression/SRS logic.
- Added React `ExpertRolesTable` scaffold and expert-role contract/sample data docs.
- Added canonical expert-role dataset for governance ingestion (`docs/data/canonical_expert_roles.json`).
- Added backend ingestion boilerplate (FastAPI route, role schema/model scaffolding, Postgres+Neo4j service wiring).
- Added 4-week engineering execution spec in `ARCHITECTURE_SPEC.md`.
- Expanded canonical role dataset from initial seed to a 9-role governance set.
- Expanded governance API scaffold with role list/get/create-or-update endpoints.
- Added Week 2/Week 4 planning artifacts (`ROLE_TASK_MATRIX`, `CURRICULUM_COST_MODEL`).
- Added visual-reference and token mapping docs to convert attached boards into build-ready guidance.
- Normalized role payload schema around `coreResponsibilities` + `automationTools` and aligned canonical dataset to extracted role definitions.
- Added web presence planning artifact for website/store/domain-hosting rollout.
- Added AppSheet system blueprint with full entities/roles/views/actions/settings/deployment-check model.
- Added AppSheet deployment evidence pack (keys/security profile, settings profile, role preview matrix, deployment checklist).
- Added cloud infrastructure translation pack (AWS CloudFormation, GCP Terraform, Azure ARM) aligned to Kubernetes runtime manifest.

### References

- `docs/adr/ADR-0001-baseline-freeze.md`
- `MASTER_2035_REFERENCE.md`
- `docs/DEPLOYMENT_READINESS.md`
- `docs/frontend/EXPERT_ROLES_TABLE.md`
- `docs/data/canonical_expert_roles.json`
- `ARCHITECTURE_SPEC.md`
