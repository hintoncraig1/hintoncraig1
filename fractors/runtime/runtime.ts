import type { Fractor, FractorInput, FractorOutput } from './types.js';
import { ReceiptLedger } from './receipt-ledger.js';

export class FractorRuntime {
  readonly ledger = new ReceiptLedger();

  async run<I, O>(fractor: Fractor<I, O>, input: FractorInput<I>): Promise<FractorOutput<O>> {
    try {
      const result = await fractor.execute(input);
      const receipt = this.ledger.issue({
        runId: input.context.runId,
        fractorId: fractor.id,
        timestampUtc: input.context.timestampUtc,
        input: input.payload,
        output: result.value ?? result.error ?? null,
        status: result.status,
      });
      return { ...result, receipt };
    } catch (error) {
      const failure = { code: 'FRactor_EXECUTION_FAILURE', message: error instanceof Error ? error.message : String(error) };
      const receipt = this.ledger.issue({
        runId: input.context.runId,
        fractorId: fractor.id,
        timestampUtc: input.context.timestampUtc,
        input: input.payload,
        output: failure,
        status: 'rejected',
      });
      return { status: 'rejected', error: failure, receipt };
    }
  }
}
