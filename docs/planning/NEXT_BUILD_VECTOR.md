# What We Should Code Next

This file converts the current baseline into the next executable work queue.

## Priority 1 — Persistence hardening (backend)

- Add SQL migrations for `expert_roles` with explicit indexes.
- Add idempotent ingestion run tracking table.
- Add retry/backoff and dead-letter handling for Neo4j sync failures.

## Priority 2 — Production API reliability

- Add auth enforcement in governance routes (real IAM seal validation adapter).
- Add pagination + filtering on `GET /api/v1/governance/roles`.
- Add health/readiness endpoints that validate Postgres and Neo4j connectivity.

## Priority 3 — Deployment safety

- Add environment overlays (`dev`, `staging`, `prod`) for Kubernetes manifests.
- Add HPA and PodDisruptionBudget for `governance-api`.
- Add CI job that lints infra templates and validates manifest schema.

## Priority 4 — App/UI closure

- Add Admin "Team & Governance" view bound to the governance API.
- Add learner-safe "Mentors & Pathways" projection in Academy Hub.
- Add table tests for role rendering and empty/error/loading states.

## Priority 5 — Evidence and operations

- Add smoke test script for ingest/list/get workflow.
- Add runbooks for incident triage (API down, DB unavailable, graph lag).
- Add measurable SLOs and dashboard query templates.
