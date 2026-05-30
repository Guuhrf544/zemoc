// Shared input guards for the data stores. Keeping invalid amounts (NaN,
// Infinity, negative or zero) out of persisted state stops them from
// contaminating balance, forecast and carryover totals downstream. The patch
// sanitizer also prevents an update from silently overwriting immutable fields
// (id, createdAt) or replacing a good amount with a bad one.

export const isValidAmount = (n: unknown): n is number =>
  typeof n === 'number' && Number.isFinite(n) && n > 0;

export function sanitizePatch<
  T extends { id: string; createdAt: string; amount: number },
>(patch: Partial<T>): Partial<T> {
  const clean: Partial<T> = { ...patch };
  delete clean.id;
  delete clean.createdAt;
  if (clean.amount !== undefined && !isValidAmount(clean.amount)) {
    delete clean.amount;
  }
  return clean;
}
