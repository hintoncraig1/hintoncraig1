import { createHash } from 'node:crypto';
import { canonicalJson, sha256 } from './hash.js';

const MASK_64 = 0xffffffffffffffffn;

export interface SeedAudit {
  algorithm: 'xorshift64*';
  seed: string;
  inputHash: string;
  parametersHash: string;
  samples: number;
  outputHash: string;
  auditHash: string;
}

export class DeterministicRng {
  private state: bigint;
  readonly seed: string;

  constructor(seed: bigint | number | string) {
    const normalized = typeof seed === 'string' ? BigInt(seed) : BigInt(seed);
    this.state = normalized & MASK_64;
    if (this.state === 0n) this.state = 0x9e3779b97f4a7c15n;
    this.seed = `0x${this.state.toString(16).padStart(16, '0')}`;
  }

  nextUint64(): bigint {
    let x = this.state;
    x ^= (x >> 12n);
    x ^= (x << 25n) & MASK_64;
    x ^= (x >> 27n);
    this.state = x & MASK_64;
    return (this.state * 2685821657736338717n) & MASK_64;
  }

  nextUnit(): number {
    const value = this.nextUint64() >> 11n;
    return Number(value) / 9007199254740992;
  }
}

export function runDeterministicMonteCarlo<T>(input: {
  seed: bigint | number | string;
  samples: number;
  parameters: unknown;
  sample: (rng: DeterministicRng, index: number) => T;
}): { results: T[]; audit: SeedAudit } {
  if (!Number.isSafeInteger(input.samples) || input.samples < 0) {
    throw new RangeError('samples must be a non-negative safe integer');
  }

  const rng = new DeterministicRng(input.seed);
  const results: T[] = [];
  for (let index = 0; index < input.samples; index += 1) {
    results.push(input.sample(rng, index));
  }

  const outputHash = sha256(results);
  const unsigned = {
    algorithm: 'xorshift64*' as const,
    seed: rng.seed,
    inputHash: sha256({ seed: rng.seed, parameters: input.parameters }),
    parametersHash: sha256(input.parameters),
    samples: input.samples,
    outputHash,
  };
  const auditHash = createHash('sha256').update(canonicalJson(unsigned)).digest('hex');

  return { results, audit: { ...unsigned, auditHash } };
}
