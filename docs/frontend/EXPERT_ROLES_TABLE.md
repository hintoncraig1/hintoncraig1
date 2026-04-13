# Expert Roles Table (React + Data Contract)

## Purpose

Define a clean, reusable rendering contract for expert roles and responsibilities with learning-goal metadata for progression and spaced repetition.

## React component

- File: `src/components/ExpertRolesTable.jsx`
- Component: `ExpertRolesTable`
- Behavior:
  - stable column rendering for role, core responsibilities, automation tools, learning goals, progression stage, and review cadence
  - includes explicit `status` column for governance visibility
  - empty-state handling
  - deterministic row key strategy (`id` preferred, then `role`)

## Row contract

Each row should conform to:

```json
{
  "id": "string",
  "role": "string",
  "coreResponsibilities": ["string"],
  "automationTools": ["string"],
  "learningGoals": ["string"],
  "progressionStage": "introduced|practiced|retained|applied|verified",
  "reviewCadenceDays": [1, 3, 7, 14, 30],
  "owner": "string",
  "status": "active|draft|retired"
}
```

## Pedagogical mapping

- `learningGoals` are assessed as discrete competencies.
- `progressionStage` tracks advancement through the mastery path.
- `reviewCadenceDays` drives spaced repetition intervals.
- Low performance should push a row back to earlier cadence windows.

## Integration notes

1. Ingest source role definitions (e.g., spreadsheet/docx extraction).
2. Normalize to the row contract.
3. Store canonical rows in backend service.
4. Render with `ExpertRolesTable` in ATRIUM/Academy surfaces.
