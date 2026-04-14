# AppSheet Settings Profile

## Information

- App Name: `SYNAPSE Workspace Governance`
- Short Description: `Role-based workspace reservation and governance app`
- About Page: includes onboarding steps, support email, and escalation contact.

## Theme & Brand

- Primary: `#38bdf8` (cyan)
- Accent: `#8b5cf6` (violet)
- Warning: `#f59e0b` (gold)
- App Logo: `assets/logo/synapse-mark.png` (placeholder)
- Launch Image: `assets/launch/synapse-launch.png` (placeholder)

## Data

- Enable explicit key columns for every table.
- Enforce references for Reservations→Users/Workstations.
- Validate enum constraints for `status` and `role`.

## Views

- Primary nav: My Bookings, Space Finder, Team Approvals.
- Menu: Locations Admin, Policies, Reports, About.
- Localization default: English (US), configurable.

## Performance

- Delta sync enabled for high-frequency tables.
- Defer image loading where possible.

## Offline mode

- Offline access enabled.
- Delayed sync allowed for Staff actions.
- Conflict handling: server wins for policy tables; user prompt for reservation conflicts.

## Integrations

- Email automation for approval events.
- Webhooks for assignment workflows.
- Zapier and Scandit optional connectors.
