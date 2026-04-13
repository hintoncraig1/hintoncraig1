# Visual Reference Map (Attached Boards → Product Surfaces)

This file maps the provided visual boards/screens to implementation surfaces so design intent can be converted into code tasks.

## Mapped references

1. **SYNAPSE OS Master Unified Architecture**
   - Use for layered architecture storytelling in architecture docs and onboarding surfaces.
2. **ORACLE Intelligence Layer**
   - Treat as a separate bounded domain; do not merge into education core without ADR.
3. **Learning-Earning-Gaming Architecture boards**
   - Use as aspirational ecosystem map; keep non-gambling and education-first constraints explicit.
4. **Plan cards (Creator / Business / Sovereign)**
   - Use for packaging tiers and entitlement matrix.
5. **Sovereign Ark reference board**
   - Use for typography, token naming, and component visual hierarchy.
6. **Aetrium/ATRIUM blueprint maps**
   - Use for navigation IA and panel transitions.
7. **Cloud monitoring and analytics screens**
   - Use to define observability dashboard requirements.
8. **Living Codex system maps**
   - Use as conceptual graph references for Neo4j relationship modeling.

## Implementation constraints

- Keep ADR-0001 topology and contracts canonical.
- Any domain expansion (betting, tokenomics, regulated flows) requires new ADR.
- Visual references are guidance; schemas and APIs remain source-of-truth for implementation.
