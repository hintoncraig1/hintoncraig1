import React from "react";
import SlotsEngine from "./games/SlotsEngine";
import RealmDuel from "./games/RealmDuel";

export default function GamesArcadeHub() {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold text-slate-100">Arcade Expansion Hub</h2>
        <p className="text-sm text-slate-300">
          Build your prize path: spin, adapt your modifier, and outsmart the realm.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <SlotsEngine />
        <RealmDuel />
      </div>
    </section>
  );
}
