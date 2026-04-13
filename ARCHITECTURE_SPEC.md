# E=MC³ LEARNING OS: ARCHITECTURE SPECIFICATION

## Executive summary

A microservices-based, psychologically grounded learning platform targeting:

- MSc Computer Science tracks (algorithms, ML/AI, security, data mining, CV/NLP)
- MBA International Project Management
- K-12 adaptive learning with scaffolding and competency pacing

## Delivery framework (4-week sequence)

| Week | Deliverable | Output format | Key artifacts |
|---|---|---|---|
| 1 | Architecture spec | GitHub MD + PDF + diagrams | Context, stack, API baseline, deployment strategy |
| 2 | Role-task matrix | GitHub MD + CSV + Gantt + PDF | Expert roles, ownership, dependencies |
| 3 | Production code | Monorepo scaffold | React + FastAPI scaffold, schemas, tests, Docker |
| 4 | Curriculum + costs | GitHub MD + interactive dashboard + PDF | MSc CS module plan, SRS logic, cost/ROI model |

## System context

```text
┌─────────────────────────────── Learner / Educator ───────────────────────────────┐
│                                                                                   │
│  ATRIUM (React) ──> API Gateway (FastAPI) ──> Postgres/pgvector + Neo4j + Ledger │
│         │                   │                         │                  │          │
│         └──── Academy + Governance views             └── receipts/events┘          │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

- Learner-facing ATRIUM UI (Academy + Governance)
- API gateway and backend services (FastAPI baseline)
- PostgreSQL/pgvector + Neo4j dual persistence
- NDJSON ledger + WebSocket event stream

## Week 1: Architecture completion criteria

- Confirm ADR-0001 alignment for boundaries and topology.
- Define API contract for governance role ingestion.
- Freeze baseline deployment model for local/dev/prod.

## Week 2: Role-task matrix completion criteria

- Ingest canonical expert roles from `docs/data/canonical_expert_roles.json`.
- Publish role ownership map across Week 1–4 deliverables.
- Identify bottlenecks and staffing risks.
- Export matrix as markdown + CSV for PMO planning.
- Canonical artifact: `docs/planning/ROLE_TASK_MATRIX.md`.

## Week 3: Production code completion criteria

- Implement role ingestion service writing to Postgres and Neo4j.
- Expose governance ingestion plus CRUD endpoints with IAM dependency hooks.
- Connect frontend expert-role table to served payload.

## Week 4: Curriculum + cost completion criteria

- Map modules to progression stages and review cadence.
- Define spaced-repetition checkpoints and regression triggers.
- Produce cost lanes and capacity assumptions for launch planning.
- Publish markdown summary and dashboard-ready dataset for reporting.
- Canonical artifact: `docs/planning/CURRICULUM_COST_MODEL.md`.

## Visual translation references

- `docs/visual/VISUAL_REFERENCE_MAP.md`
- `docs/frontend/SYNAPSE_VISUAL_TOKENS.md`

## Phase breakdown (execution)

- **Phase 1: Architecture + MVP scaffold** (Weeks 1–2)
- **Phase 2: Production code + ingestion hardening** (Week 3)
- **Phase 3: Curriculum intelligence + cost analytics** (Week 4)

## Optional commercialization extension

- `docs/planning/WEB_PRESENCE_PLAN.md` for website, store, and domain/hosting rollout tasks.
- `docs/appsheet/APPSHEET_SYSTEM_BLUEPRINT.md` for entities, roles, views, actions, settings, and deployment checklist.
- `docs/appsheet/DEPLOYMENT_READINESS_CHECKLIST.md` for pre-deploy validation gates.
- `docs/deployment/INFRA_TRANSLATION_GUIDE.md` for AWS/GCP/Azure infrastructure translation.
