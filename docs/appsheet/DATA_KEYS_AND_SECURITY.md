# Data Keys and Security Filters Profile

## Key policy

All tables use explicit unique keys with `*_id` naming, e.g. `user_id`, `reservation_id`, `workstation_id`.

## Sensitive tables requiring security filters

| Table | Sensitive fields | Recommended security filter |
|---|---|---|
| Users | email, role, manager links | `[email] = USEREMAIL() OR IN(USERROLE(), {"Admin"})` |
| Reservations | requester identity, approval status | `OR([requester_email]=USEREMAIL(), IN(USERROLE(), {"Admin","Manager"}))` |
| Assignments | manager decisions | `IN(USERROLE(), {"Admin","Manager"})` |
| Policies | governance constraints | `IN(USERROLE(), {"Admin"})` |
| UtilizationReports | org-level analytics | `IN(USERROLE(), {"Admin","Manager"})` |

## Security note

Use security filters for data access control. `Show_If` should be treated only as UX visibility control.
