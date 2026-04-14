# Games Arcade Hub

This document defines the first expansion set for online slots and head-to-head strategy gameplay.

## Components

- `src/components/GamesArcadeHub.jsx`
  - Parent shell that renders both games as the arcade expansion surface.
- `src/components/games/SlotsEngine.jsx`
  - 3-reel slot prototype with adjustable bet + realm modifier and payout rules.
- `src/components/games/RealmDuel.jsx`
  - Quick strategy duel (strike/guard/feint) for outsmart-and-outplay loop.

## Gameplay intent

1. **Carve your path through the realm**
   - Players tune a modifier and risk profile to seek higher slot rewards.
2. **Own modifier to boost your prize**
   - Realm multiplier (`x1.00`–`x3.00`) scales winnings.
3. **Outsmart and outplay**
   - Duel mode rewards tactical decisions against randomized enemy actions.

## Integration notes

- Place `GamesArcadeHub` under the ATRIUM Arcade panel.
- Connect credits and results to backend events when gameplay telemetry endpoints are ready.
- Promote payout and duel outcomes into future reward/token services through ADR-traceable changes.
