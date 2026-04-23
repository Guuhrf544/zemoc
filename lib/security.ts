import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const PIN_HASH_KEY = 'zemoc_pin_hash';
const PIN_SALT_KEY = 'zemoc_pin_salt';
const ATTEMPTS_KEY = 'zemoc_pin_attempts';
const LOCKOUT_KEY = 'zemoc_pin_lockout';

const MAX_ATTEMPTS = 5;
const LOCKOUT_BASE_MS = 60_000;

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'wrong'; remaining: number }
  | { ok: false; reason: 'locked'; until: number }
  | { ok: false; reason: 'no-pin' };

async function sha256(text: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
}

function randomSalt(): string {
  return Array.from(Crypto.getRandomBytes(16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function savePin(pin: string): Promise<void> {
  const salt = randomSalt();
  const hash = await sha256(salt + pin);
  await SecureStore.setItemAsync(PIN_SALT_KEY, salt);
  await SecureStore.setItemAsync(PIN_HASH_KEY, hash);
  await SecureStore.deleteItemAsync(ATTEMPTS_KEY);
  await SecureStore.deleteItemAsync(LOCKOUT_KEY);
}

export async function verifyPin(pin: string): Promise<VerifyResult> {
  const lockoutRaw = await SecureStore.getItemAsync(LOCKOUT_KEY);
  const parsedLockout = lockoutRaw ? Number(lockoutRaw) : 0;
  const lockedUntil = Number.isFinite(parsedLockout) ? parsedLockout : 0;
  if (lockedUntil > Date.now()) {
    return { ok: false, reason: 'locked', until: lockedUntil };
  }

  const salt = await SecureStore.getItemAsync(PIN_SALT_KEY);
  const stored = await SecureStore.getItemAsync(PIN_HASH_KEY);
  if (!salt || !stored) return { ok: false, reason: 'no-pin' };

  const hash = await sha256(salt + pin);
  if (hash === stored) {
    await SecureStore.deleteItemAsync(ATTEMPTS_KEY);
    await SecureStore.deleteItemAsync(LOCKOUT_KEY);
    return { ok: true };
  }

  const prevRaw = Number((await SecureStore.getItemAsync(ATTEMPTS_KEY)) ?? '0');
  const prev = Number.isFinite(prevRaw) ? prevRaw : 0;
  const attempts = prev + 1;
  await SecureStore.setItemAsync(ATTEMPTS_KEY, String(attempts));

  if (attempts >= MAX_ATTEMPTS) {
    const factor = Math.min(attempts - MAX_ATTEMPTS + 1, 10);
    const until = Date.now() + LOCKOUT_BASE_MS * factor;
    await SecureStore.setItemAsync(LOCKOUT_KEY, String(until));
    return { ok: false, reason: 'locked', until };
  }
  return { ok: false, reason: 'wrong', remaining: MAX_ATTEMPTS - attempts };
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_HASH_KEY);
  await SecureStore.deleteItemAsync(PIN_SALT_KEY);
  await SecureStore.deleteItemAsync(ATTEMPTS_KEY);
  await SecureStore.deleteItemAsync(LOCKOUT_KEY);
}

export async function hasStoredPin(): Promise<boolean> {
  return (await SecureStore.getItemAsync(PIN_HASH_KEY)) !== null;
}
