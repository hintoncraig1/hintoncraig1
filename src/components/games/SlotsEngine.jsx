import React, { useMemo, useState } from "react";

const REELS = ["🍒", "💎", "⚡", "👑", "🜂", "🜁", "🜄", "🜃"];
const JACKPOT_SYMBOL = "👑";

function pickRandomSymbol() {
  return REELS[Math.floor(Math.random() * REELS.length)];
}

function calculatePayout(spin, bet, realmBoost = 1) {
  const unique = new Set(spin).size;

  if (unique === 1 && spin[0] === JACKPOT_SYMBOL) {
    return Math.floor(bet * 25 * realmBoost);
  }

  if (unique === 1) {
    return Math.floor(bet * 10 * realmBoost);
  }

  if (unique === 2) {
    return Math.floor(bet * 3 * realmBoost);
  }

  return 0;
}

export default function SlotsEngine() {
  const [credits, setCredits] = useState(1000);
  const [bet, setBet] = useState(25);
  const [realmBoost, setRealmBoost] = useState(1.0);
  const [spin, setSpin] = useState([pickRandomSymbol(), pickRandomSymbol(), pickRandomSymbol()]);
  const [lastWin, setLastWin] = useState(0);

  const canSpin = credits >= bet && bet > 0;

  const statusText = useMemo(() => {
    if (!canSpin) return "Increase credits or lower your bet to continue.";
    if (lastWin > 0) return `Victory! You won ${lastWin} credits.`;
    return "Spin to carve your path through the realm.";
  }, [canSpin, lastWin]);

  const onSpin = () => {
    if (!canSpin) return;

    const nextSpin = [pickRandomSymbol(), pickRandomSymbol(), pickRandomSymbol()];
    const winAmount = calculatePayout(nextSpin, bet, realmBoost);

    setSpin(nextSpin);
    setCredits((current) => current - bet + winAmount);
    setLastWin(winAmount);
  };

  return (
    <section className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-100">
      <h3 className="text-xl font-semibold">Realm Slots</h3>
      <p className="mt-1 text-sm text-slate-300">{statusText}</p>

      <div className="mt-4 flex items-center gap-3 text-4xl" aria-label="slot-reels">
        {spin.map((symbol, index) => (
          <div key={`${symbol}-${index}`} className="rounded-md border border-slate-600 bg-slate-900 p-3">
            {symbol}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <label className="text-sm">
          Bet
          <input
            className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-2 py-1"
            type="number"
            min={5}
            step={5}
            value={bet}
            onChange={(event) => setBet(Number(event.target.value))}
          />
        </label>

        <label className="text-sm">
          Realm Modifier
          <input
            className="mt-1 w-full"
            type="range"
            min={1}
            max={3}
            step={0.25}
            value={realmBoost}
            onChange={(event) => setRealmBoost(Number(event.target.value))}
          />
          <span className="text-xs text-slate-300">x{realmBoost.toFixed(2)}</span>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm">Credits: {credits}</span>
        <button
          type="button"
          onClick={onSpin}
          disabled={!canSpin}
          className="rounded bg-indigo-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Spin
        </button>
      </div>
    </section>
  );
}
