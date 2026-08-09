export type FractorStatus = 'accepted' | 'rejected';

export interface FractorContext {
  runId: string;
  timestampUtc: string;
  source: string;
  stateVersion: string;
}

export interface FractorInput<T> {
  context: FractorContext;
  payload: T;
}

export interface FractorOutput<T> {
  status: FractorStatus;
  value?: T;
  error?: { code: string; message: string };
  receipt?: ReceiptRecord;
}

export interface ReceiptRecord {
  receiptId: string;
  runId: string;
  fractorId: string;
  timestampUtc: string;
  inputHash: string;
  outputHash: string;
  previousReceiptHash: string | null;
  receiptHash: string;
  status: FractorStatus;
  metadata: Record<string, string | number | boolean>;
}

export interface Fractor<I, O> {
  readonly id: string;
  execute(input: FractorInput<I>): Promise<FractorOutput<O>>;
}
