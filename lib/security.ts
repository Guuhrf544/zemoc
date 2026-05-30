import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const PIN_HASH_KEY = 'zemoc_pin_hash';
const PIN_SALT_KEY = 'zemoc_pin_salt';
const ATTEMPTS_KEY = 'zemoc_pin_attempts';
const LOCKOUT_KEY = 'zemoc_pin_lockout';

const MAX_ATTEMPTS = 5;
const LOCKOUT_BASE_MS = 60_000;

// Key-stretching rounds. A 4-digit PIN can't be made brute-force-proof by a KDF
// alone, so the primary protection is storing the hash device-only in the
// Keychain (see SECURE_OPTS) — it never leaves the device or lands in a backup.
// The rounds add defense-in-depth against a naive offline attacker. Kept modest
// because expo-crypto only offers async per-call digests (no native PBKDF2);
// tunable after measuring on-device unlock latency.
const KDF_ROUNDS = 1000;

// Store secrets only on THIS device and only while it is unlocked — keeps the
// PIN hash/salt out of iCloud Keychain and encrypted device backups, which is
// the realistic extraction vector for an offline brute-force.
const SECURE_OPTS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'wrong'; remaining: number }
  | { ok: false; reason: 'locked'; until: number }
  | { ok: false; reason: 'no-pin' };

async function sha256(text: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
}

// Iterated SHA-256 key-stretching. rounds=0 reproduces the legacy single-hash
// scheme exactly, so old PINs still verify and are transparently re-hashed with
// the current scheme on the next successful unlock.
async function deriveHash(pin: string, salt: string, rounds: number): Promise<string> {
  let h = await sha256(salt + pin);
  for (let i = 0; i < rounds; i++) {
    h = await sha256(salt + h);
  }
  return h;
}

// Constant-time comparison so verification doesn't leak match progress via timing.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function randomSalt(): string {
  return Array.from(Crypto.getRandomBytes(16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function savePin(pin: string): Promise<void> {
  const salt = randomSalt();
  const hash = await deriveHash(pin, salt, KDF_ROUNDS);
  await SecureStore.setItemAsync(PIN_SALT_KEY, salt, SECURE_OPTS);
  await SecureStore.setItemAsync(PIN_HASH_KEY, `${KDF_ROUNDS}:${hash}`, SECURE_OPTS);
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

  // Stored format: "<rounds>:<hash>" (current) or a bare hex hash (legacy = 0 rounds).
  const sep = stored.indexOf(':');
  const parsedRounds = sep >= 0 ? Number(stored.slice(0, sep)) : 0;
  const rounds = Number.isFinite(parsedRounds) && parsedRounds >= 0 ? parsedRounds : 0;
  const storedHash = sep >= 0 ? stored.slice(sep + 1) : stored;

  const hash = await deriveHash(pin, salt, rounds);
  if (timingSafeEqual(hash, storedHash)) {
    await SecureStore.deleteItemAsync(ATTEMPTS_KEY);
    await SecureStore.deleteItemAsync(LOCKOUT_KEY);
    // Upgrade legacy / weaker hashes to the current scheme + storage options.
    if (rounds !== KDF_ROUNDS) {
      await savePin(pin);
    }
    return { ok: true };
  }

  const prevRaw = Number((await SecureStore.getItemAsync(ATTEMPTS_KEY)) ?? '0');
  const prev = Number.isFinite(prevRaw) ? prevRaw : 0;
  const attempts = prev + 1;
  await SecureStore.setItemAsync(ATTEMPTS_KEY, String(attempts), SECURE_OPTS);

  if (attempts >= MAX_ATTEMPTS) {
    const factor = Math.min(attempts - MAX_ATTEMPTS + 1, 10);
    const until = Date.now() + LOCKOUT_BASE_MS * factor;
    await SecureStore.setItemAsync(LOCKOUT_KEY, String(until), SECURE_OPTS);
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
