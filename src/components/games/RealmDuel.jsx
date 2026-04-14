import React, { useMemo, useState } from "react";

const MOVES = [
  { key: "strike", label: "Strike", beats: "feint" },
  { key: "guard", label: "Guard", beats: "strike" },
  { key: "feint", label: "Feint", beats: "guard" }
];

function randomMove() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function resolveRound(playerMove, enemyMove) {
  if (playerMove.key === enemyMove.key) return "draw";
  return playerMove.beats === enemyMove.key ? "win" : "loss";
}

export default function RealmDuel() {
  const [playerScore, setPlayerScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [roundResult, setRoundResult] = useState("Choose your move.");
  const [enemyChoice, setEnemyChoice] = useState("?");

  const crownLeader = useMemo(() => {
    if (playerScore === enemyScore) return "Deadlock in the realm.";
    return playerScore > enemyScore ? "You outplay the realm." : "The realm pushes back.";
  }, [playerScore, enemyScore]);

  const playRound = (move) => {
    const enemyMove = randomMove();
    const outcome = resolveRound(move, enemyMove);

    setEnemyChoice(enemyMove.label);

    if (outcome === "win") {
      setPlayerScore((score) => score + 1);
      setRoundResult(`You win the round with ${move.label}.`);
      return;
    }

    if (outcome === "loss") {
      setEnemyScore((score) => score + 1);
      setRoundResult(`Enemy wins with ${enemyMove.label}.`);
      return;
    }

    setRoundResult("Round tied. Reset and outsmart.");
  };

  return (
    <section className="rounded-lg border border-emerald-700 bg-emerald-950 p-4 text-emerald-100">
      <h3 className="text-xl font-semibold">Outsmart Duel</h3>
      <p className="mt-1 text-sm text-emerald-300">{roundResult}</p>

      <div className="mt-3 text-sm text-emerald-200">Enemy move: {enemyChoice}</div>
      <div className="mt-2 text-sm">
        Score — You: {playerScore} | Realm: {enemyScore}
      </div>
      <div className="text-xs text-emerald-300">{crownLeader}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {MOVES.map((move) => (
          <button
            key={move.key}
            type="button"
            onClick={() => playRound(move)}
            className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
          >
            {move.label}
          </button>
        ))}
      </div>
    </section>
  );
}
