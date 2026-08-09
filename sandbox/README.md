# Atrium Unified Stateful Sandbox

## Status

**SCAFFOLDED / NOT DEPLOYED.** This branch contains a reproducible Docker Compose and Codespaces development surface. No external webhook, NFT minting, advertising, or payment integration is configured by this commit.

## Services

- `core`: receipt-backed mint acceptance and health boundary.
- `scheduler`: deterministic local metadata generation with persisted state.
- `webhook`: Discord and Telegram notification adapters; disabled when credentials are absent.
- `dashboard`: minimal receipt inspection surface.

## Run

```bash
docker compose config
docker compose up --build
```

Dashboard: `http://localhost:8082`
Webhook: `http://localhost:8081`

## Mint alert flow

`mint event -> webhook -> Discord/Telegram adapters -> receipt`

Notifications are fail-safe: absent credentials produce no outbound request. Real secrets belong in Codespaces secrets or local environment injection, never Git.

## Boundary

This scaffold deliberately does **not** auto-publish advertisements, execute financial trades, mint blockchain assets, or install persistent background processes outside the Compose environment. Those capabilities can be added behind explicit adapters, validation, rate limits, idempotency keys, and receipt checkpoints.
