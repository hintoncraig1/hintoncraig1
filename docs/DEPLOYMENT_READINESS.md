# Deployment Readiness (Section-by-Section)

## 1) Architecture readiness

- **Status:** Ready under ADR-0001 baseline freeze.
- **Canonical topology:** API gateway, CAS/vault ingest, NDJSON spine ledger, PostgreSQL+pgvector, Neo4j, WebSocket stream.
- **Merge gate:** Any topology/contract replacement requires superseding ADR before merge to `master`.

## 2) Code readiness

- **Documentation baseline:** ADR, master reference, and architecture changelog are in place.
- **UI scaffold addition:** A cleaned React table component is provided for expert-role rendering (`src/components/ExpertRolesTable.jsx`).
- **Data contract draft:** Expert-role row schema documented in `docs/frontend/EXPERT_ROLES_TABLE.md`.
- **Governance API baseline:** role ingestion + CRUD endpoints are scaffolded in `backend/app/api/routes/governance.py`.

## 3) Cost breakdown (planning-level)

This is a non-binding planning model for roadmap sequencing:

| Cost lane | Driver | Relative cost |
|---|---|---|
| Core platform services | Gateway + ledger + persistence + observability | High |
| Knowledge/semantic layer | pgvector ingestion + Neo4j graph sync | Medium-High |
| Real-time UX layer | WebSocket pulse/receipt stream + ATRIUM surface | Medium |
| Learning system logic | SRS scheduling, progression state, analytics | Medium |
| Content operations | Role definitions, goal maps, curriculum updates | Medium |

## 4) Pedagogical logic readiness

- **Model:** mastery progression with spaced repetition + competency gates.
- **Progression states:** `introduced -> practiced -> retained -> applied -> verified`.
- **SRS cadence:** post-introduction review windows such as day 1, 3, 7, 14, 30 (configurable).
- **Promotion criteria:** accuracy, response latency, and consistency thresholds.
- **Regression behavior:** missed/low-confidence skills are routed to shorter review intervals.

## 5) Go-live interpretation

Current state is **deployment-ready for baseline architecture governance and scaffolding**.

Prior to production rollout, attach:

1. environment-specific infra sizing,
2. concrete cloud/provider pricing,
3. compliance/security controls,
4. finalized role payloads from uploaded source files.
