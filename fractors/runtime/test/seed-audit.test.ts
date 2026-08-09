import test from 'node:test';
import assert from 'node:assert/strict';
import { runDeterministicMonteCarlo } from '../seed-audit.js';

test('same seed and parameters reproduce identical audited output', () => {
  const run = () => runDeterministicMonteCarlo({
    seed: '5410',
    samples: 100,
    parameters: { bankroll: 100, edge: 0.05 },
    sample: (rng) => rng.nextUnit(),
  });

  const a = run();
  const b = run();
  assert.deepEqual(a.results, b.results);
  assert.equal(a.audit.outputHash, b.audit.outputHash);
  assert.equal(a.audit.auditHash, b.audit.auditHash);
});

test('different seeds produce a different audited sequence', () => {
  const make = (seed: string) => runDeterministicMonteCarlo({
    seed,
    samples: 100,
    parameters: { bankroll: 100 },
    sample: (rng) => rng.nextUnit(),
  });

  assert.notEqual(make('1').audit.outputHash, make('2').audit.outputHash);
});

test('zero seed is normalized to a non-zero generator state', () => {
  const run = runDeterministicMonteCarlo({
    seed: 0,
    samples: 1,
    parameters: {},
    sample: (rng) => rng.nextUnit(),
  });
  assert.match(run.audit.seed, /^0x[0-9a-f]{16}$/);
  assert.notEqual(run.audit.seed, '0x0000000000000000');
});
