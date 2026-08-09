import { randomUUID } from 'node:crypto';
import { sha256 } from './hash.js';
import type { ReceiptRecord } from './types.js';

export class ReceiptLedger {
  private previousReceiptHash: string | null = null;

  issue(input: {
    runId: string;
    fractorId: string;
    timestampUtc: string;
    input: unknown;
    output: unknown;
    status: 'accepted' | 'rejected';
    metadata?: Record<string, string | number | boolean>;
  }): ReceiptRecord {
    const inputHash = sha256(input.input);
    const outputHash = sha256(input.output);
    const unsigned = {
      receiptId: randomUUID(),
      runId: input.runId,
      fractorId: input.fractorId,
      timestampUtc: input.timestampUtc,
      inputHash,
      outputHash,
      previousReceiptHash: this.previousReceiptHash,
      status: input.status,
      metadata: input.metadata ?? {},
    };
    const receiptHash = sha256(unsigned);
    const receipt: ReceiptRecord = { ...unsigned, receiptHash };
    this.previousReceiptHash = receiptHash;
    return receipt;
  }
}
