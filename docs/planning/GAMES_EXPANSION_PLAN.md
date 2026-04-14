# Games Expansion Plan

## Objective

Expand online slots and skill-based games with a modular React-first architecture and backend-ready event contracts.

## Phase 1 (implemented)

- Slots prototype (`SlotsEngine`) with payout logic and player-controlled modifier.
- Strategy duel prototype (`RealmDuel`) for short-session tactical gameplay.
- Combined `GamesArcadeHub` shell for panel-level integration.

## Phase 2 (next)

- Persist player credits/session stats via governance-compatible API contracts.
- Add anti-cheat integrity checks for client-submitted outcomes.
- Add wallet/reward mapping once tokenomics ADR is approved.

## Phase 3 (scale)

- Tournament queues and matchmaking.
- RTP tuning + feature flags for slot balancing.
- Real-time leaderboard streams over WebSocket.

## Event contract draft

```json
{
  "eventType": "arcade.round.completed",
  "game": "slots|duel",
  "userId": "uuid",
  "stake": 25,
  "payout": 75,
  "modifier": 1.5,
  "metadata": {
    "result": "win|loss|draw",
    "symbols": ["🍒", "💎", "⚡"]
  },
  "occurredAt": "2026-04-13T00:00:00Z"
}
```
