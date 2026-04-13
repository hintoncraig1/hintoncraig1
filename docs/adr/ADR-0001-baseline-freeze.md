# ADR-0001 — Baseline Design Freeze for SYNAPSE / FORNIX OS

- **Status:** Accepted
- **Decision Type:** Architectural Decision Record
- **Effective Date:** 2026-04-13
- **Authority:** Director approval recorded in this thread
- **Scope:** Primary operating surface, backend architecture, scaffold pack, contracts, schema layer, and proof model

## Decision

The current design and scaffold pack are formally approved and frozen as the canonical baseline for the master 2035 reference.

This freeze applies to:

- backend architecture
- repo structure
- OpenAPI contract baseline
- Docker Compose topology
- SQL migration baseline
- proof / ledger schema direction
- ATRIUM primary operating surface
- design tokens and core screen definitions
- first proof-path implementation order

## Accepted baseline

The following are now treated as the approved foundation.

### Product / system baseline

- SYNAPSE / FORNIX OS
- ATRIUM as the primary operating surface
- edge node + core node split
- local-first, proof-first, bounded-authority model

### Backend baseline

- API gateway
- vault / CAS ingest path
- NDJSON spine ledger
- PostgreSQL + pgvector semantic layer
- Neo4j relational / skill graph layer
- WebSocket stream layer for pulse and receipts

### Build / deployment baseline

- mono-repo scaffold
- Docker Compose dev/prod topology
- migration-led database setup
- service-separated architecture

### UI / interaction baseline

- Biometric Gate
- ATRIUM Dashboard
- Arcade & Academy Hub
- design token set already defined in the scaffold

## Freeze rule

From this point onward:

1. **No silent redesigns**  
   Any structural change must be explicit.
2. **No breaking architectural substitutions**  
   No replacement of core storage, proof, or service topology without a new ADR.
3. **No drift from accepted contracts**  
   OpenAPI, schema shapes, and migration direction remain canonical until superseded.
4. **No merging into the master 2035 reference without ADR traceability**  
   Every major addition must reference this baseline or supersede it.

## Change control

All future changes must use one of these paths.

### Allowed without new ADR

- bug fixes
- implementation detail completion
- non-breaking endpoint additions
- UI polish that does not change operating model
- internal refactors that preserve contracts

### Requires a new ADR

- changing the auth model
- replacing NDJSON spine logic
- changing CAS layout
- replacing Postgres/pgvector or Neo4j roles
- changing the primary UI operating surface
- changing service boundaries
- introducing live tokenomics or regulated finance flows
- changing canonical folder structure

## Canonical reference designation

This baseline is now the master 2035 reference seed for future work.

Use this naming convention in the project:

- `ADR-0001-baseline-freeze.md`
- `MASTER_2035_REFERENCE.md`
- `CHANGELOG_ARCHITECTURE.md`

## Consequences

### Positive

- engineering can proceed without re-litigating fundamentals
- design and backend remain synchronized
- future work can be validated against a fixed baseline
- merge decisions become auditable

### Trade-off

- experimentation now needs explicit separation from canonical architecture
- major changes require formal ADR overhead

## Acceptance statement

The current design is accepted as the canonical frozen baseline.
All future work should inherit from this decision unless a later ADR explicitly supersedes part of it.

## Pre-merge approval gate

Before merging into `master`, this ADR serves as the formal approval and freeze checkpoint for the current design baseline. Any proposed deviation must be documented in a new ADR and approved before merge.

## Recommended next ADR sequence

- ADR-0002: Gateway stack freeze
- ADR-0003: IAM seal auth model
- ADR-0004: Ledger receipt verification model
- ADR-0005: Semantic memory ingestion pipeline
- ADR-0006: ATRIUM operating surface interaction rules
- ADR-0007: Sandbox vs real-edition economy boundary

## Validation status

- baseline freeze recorded: yes
- backend architecture accepted: yes
- primary operating surface accepted: yes
- future merge guardrails defined: yes
- ADR-style acceptance complete: yes

## Delta

- design formally frozen
- backend architecture formally accepted
- baseline elevated to master 2035 seed reference
- future work now requires ADR-traceable change control
