const USERS_KEY = "tripdna.localAccounts.v1";
const SESSION_KEY = "tripdna.localSession.v1";
const PASSWORD_ITERATIONS = 210_000;

function requireStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("Local accounts are unavailable in this app environment.");
  }
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error("Secure local login is not supported by this app environment. Please update TripDNA and try again.");
  }
  return window.localStorage;
}

function readUsers(storage) {
  try {
    const users = JSON.parse(storage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users.filter((user) =>
      user && typeof user.email === "string" &&
      typeof user.salt === "string" &&
      typeof user.passwordHash === "string"
    ) : [];
  } catch {
    throw new Error("TripDNA could not read local account data. Use Backup & Restore for your trips, then contact support before clearing app data.");
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) return new Uint8Array();
  return new Uint8Array(hex.match(/.{2}/g).map((part) => Number.parseInt(part, 16)));
}

function constantTimeEqual(left, right) {
  const a = hexToBytes(left);
  const b = hexToBytes(right);
  if (!a.length || a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) mismatch |= a[index] ^ b[index];
  return mismatch === 0;
}

async function derivePasswordHash(password, saltHex) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: hexToBytes(saltHex),
    iterations: PASSWORD_ITERATIONS,
    hash: "SHA-256",
  }, key, 256);
  return bytesToHex(new Uint8Array(bits));
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function publicUser(user) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    isLocalAccount: true,
  };
}

function saveSession(storage, user) {
  const session = publicUser(user);
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getLocalSession() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
    if (!parsed || parsed.isLocalAccount !== true ||
        typeof parsed.email !== "string" || typeof parsed.uid !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function createLocalAccount({ name, email, password }) {
  const storage = requireStorage();
  const normalizedEmail = normalizeEmail(email);
  const displayName = String(name || "").trim();

  if (displayName.length < 2 || displayName.length > 80) {
    throw new Error("Enter your name using 2 to 80 characters.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) {
    throw new Error("Enter a valid email address.");
  }
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    throw new Error("Your password must contain 8 to 128 characters.");
  }

  const users = readUsers(storage);
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("A local profile already exists for this email on this PC. Sign in instead.");
  }

  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const saltHex = bytesToHex(salt);
  const passwordHash = await derivePasswordHash(password, saltHex);
  const user = {
    uid: "local-" + crypto.randomUUID(),
    email: normalizedEmail,
    displayName,
    salt: saltHex,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  try {
    storage.setItem(USERS_KEY, JSON.stringify(users));
    return saveSession(storage, user);
  } catch {
    throw new Error("TripDNA could not save this local profile. Check that the app has available storage, then try again.");
  }
}

export async function signInLocalAccount({ email, password }) {
  const storage = requireStorage();
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || typeof password !== "string" || !password) {
    throw new Error("Enter your email address and password.");
  }

  const user = readUsers(storage).find((item) => item.email === normalizedEmail);
  if (!user) throw new Error("No local profile was found for this email on this PC. Create a local profile first.");

  const attempt = await derivePasswordHash(password, user.salt);
  if (!constantTimeEqual(attempt, user.passwordHash)) {
    throw new Error("The email or password is incorrect.");
  }
  return saveSession(storage, user);
}

export function signOutLocalAccount() {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.removeItem(SESSION_KEY);
}
