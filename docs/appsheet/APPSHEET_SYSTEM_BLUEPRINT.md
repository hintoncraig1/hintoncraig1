# AppSheet System Blueprint (Admin / Manager / Staff)

This blueprint converts the workstation-booking analysis into a build-ready architecture table for implementation.

## 1) High-level entity model

| Entity | Purpose | Key fields |
|---|---|---|
| Users | Identity profile for all app users | user_id, email, role, department_id, manager_id, status |
| Roles | Permission tier definition | role_id, role_name (Admin/Manager/Staff), permission_scope |
| Locations | Physical office/facility units | location_id, name, timezone, address |
| Departments | Organizational grouping | department_id, name, location_id |
| WorkstationCategories | Space type grouping | category_id, category_name, constraints |
| Workstations | Reservable workspace inventory | workstation_id, location_id, category_id, status |
| Reservations | Booking request + approval lifecycle | reservation_id, requester_id, workstation_id, status, start_at, end_at |
| Assignments | Manager assignment events | assignment_id, reservation_id, assigned_by, assigned_to |
| Checkins | Occupancy state transitions | checkin_id, reservation_id, checked_in_at, checked_out_at |
| Policies | Reservation and governance rules | policy_id, location_id, role_scope, rule_json |
| Notifications | Approval and reminder events | notification_id, user_id, type, delivery_status |
| UtilizationReports | Aggregated usage analytics | report_id, location_id, period_start, period_end, occupancy_rate |

## 2) Role model

| Role | Permissions | Primary outcomes |
|---|---|---|
| Admin | Full CRUD on locations, workstations, users, policies, reports | Governance and global setup |
| Manager | Approve/reject requests, assign workstations, view team analytics | Operational approval and allocation |
| Staff | Create requests, view own bookings, check-in/check-out | Daily workspace usage |

## 3) View map (UI elements)

| View | Type | Persona | Backing table/slice | Nav placement |
|---|---|---|---|---|
| My Bookings | Deck/Table | Staff | Reservations_Staff | Primary |
| Space Finder | Deck | Staff | Workstations_Available | Primary |
| Request Form | Form | Staff | Reservations | Primary action |
| Team Approvals | Table | Manager | Reservations_Pending | Primary |
| Assignment Queue | Table | Manager | Assignments_Open | Primary |
| Locations Admin | Table/Form | Admin | Locations | Menu |
| Workstations Admin | Table/Form | Admin | Workstations | Menu |
| Policies Admin | Detail/Form | Admin | Policies | Menu |
| Utilization Dashboard | Dashboard/Chart | Admin/Manager | UtilizationReports | Menu |
| About / User Guide | Detail | All | Static/About | Menu |

## 4) Action model

| Action | Trigger | Role | Effect |
|---|---|---|---|
| Submit reservation | Form save | Staff | Create `Reservations` row (pending) |
| Approve reservation | Row action | Manager/Admin | Set status=approved, notify requester |
| Reject reservation | Row action | Manager/Admin | Set status=rejected, notify requester |
| Assign workstation | Row action | Manager | Create `Assignments` row |
| Check in | Action button | Staff | Create/Update `Checkins` timestamp |
| Check out | Action button | Staff | Close check-in session |
| Conflict resolver | Automation/bot | Manager/Admin | Reject overlapping pending requests when one is approved |

## 5) App settings configuration checklist

| Settings area | Configuration intent |
|---|---|
| Information | About page text, app icon, support contacts, onboarding links |
| Theme & brand | SYNAPSE palette, typography, logo, density/font size |
| Data | Table relationships, key columns, enum constraints, valid-if policies |
| Views | Persona-based navigation, localization, view defaults |
| Performance | Sync policy, delayed sync, selective column loading |
| Offline mode | Offline read/write, cached tables, conflict behavior |
| Integrations | Email/webhook/Zapier/Scandit/API integrations |

## 6) Domain map

- Identity & access
- Facility inventory
- Reservation workflow
- Attendance operations
- Policy/governance
- Reporting/analytics
- Integrations/automation
- Deployment/operations

## 7) Deployment check (must-pass)

1. Run AppSheet deployment check and clear errors.
2. Validate role-based visibility and security filters.
3. Test reservation lifecycle (submit/approve/assign/check-in/check-out).
4. Test overlap conflict automation.
5. Test offline behavior and sync reconciliation.
6. Verify integrations (email/webhooks).
7. Run UAT for Admin, Manager, Staff personas.
8. Publish and monitor usage + error telemetry.

## 8) Recommended implementation order

1. Data schema + keys + references
2. Role security filters
3. Core reservation views/forms
4. Approval + assignment actions
5. Automations and notifications
6. Dashboard and utilization reports
7. Offline/performance tuning
8. Deployment check and release

## 9) Deployment evidence pack

- `docs/appsheet/DEPLOYMENT_READINESS_CHECKLIST.md`
- `docs/appsheet/DATA_KEYS_AND_SECURITY.md`
- `docs/appsheet/APPSHEET_SETTINGS_PROFILE.md`
- `docs/appsheet/ROLE_PREVIEW_TEST_MATRIX.md`
