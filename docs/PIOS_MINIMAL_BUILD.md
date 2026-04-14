# Personal Intelligence OS — Minimal Ledger-Backed Build

This is the tight core implementation:

1. **Save entry -> write ledger receipt**
2. **Store file/note metadata -> link content hash**
3. **Show timeline**
4. **Generate summary**

## API surface

- `POST /api/v1/pios/entries`
  - Captures an entry and writes an append-only ledger event (`entry.captured`).
- `GET /api/v1/pios/timeline`
  - Returns chronological memory feed from `vault_entries`.
- `GET /api/v1/pios/ledger`
  - Returns append-only receipts from `ledger_events`.
- `GET /api/v1/pios/summary`
  - Returns lightweight theme summary over timeline entries.

## Data model

- `vault_entries`
  - `id`, `entry_type`, `title`, `content`, `source_uri`, `content_hash`, `created_at`
- `ledger_events`
  - `id`, `event_type`, `entry_id`, `event_hash`, `previous_hash`, `created_at`

## Engine loop

capture -> hash -> store -> link -> view -> act -> improve
