export const BACKUP_FORMAT = "tripdna-backup";
export const BACKUP_VERSION = 1;
export const MAX_BACKUP_BYTES = 10 * 1024 * 1024;

const ARRAY_LIMITS = {
  savedTrips: 20,
  favorites: 100,
  recentSearches: 10,
  tripDataCache: 4,
  tripDnaItineraries: 12,
  tripDnaOfflinePacks: 8,
};
const BUDGET_PREFIX = "tripDnaBudget:";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isSupportedKey(key) {
  return Object.hasOwn(ARRAY_LIMITS, key) || (
    key.startsWith(BUDGET_PREFIX) &&
    key.length > BUDGET_PREFIX.length &&
    key.length <= 520 &&
    ![...key].some((character) => { const code = character.charCodeAt(0); return code < 32 || code === 127; })
  );
}

function getSupportedKeys(storage) {
  const keys = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && isSupportedKey(key)) keys.push(key);
  }
  return keys;
}

function validateEntry(key, value) {
  if (Object.hasOwn(ARRAY_LIMITS, key)) {
    if (!Array.isArray(value)) throw new Error('Backup item "' + key + '" must be an array.');
    if (value.length > ARRAY_LIMITS[key]) {
      throw new Error('Backup item "' + key + '" exceeds its supported limit.');
    }
    if (value.some((item) => !isPlainObject(item))) {
      throw new Error('Backup item "' + key + '" contains an invalid record.');
    }
    return;
  }

  if (key.startsWith(BUDGET_PREFIX)) {
    if (!isPlainObject(value) || !isPlainObject(value.settings) || !Array.isArray(value.expenses)) {
      throw new Error("A budget backup is missing settings or its expense list.");
    }
    if (value.expenses.length > 100 || value.expenses.some((item) => !isPlainObject(item))) {
      throw new Error("A budget backup contains an invalid expense list.");
    }
    return;
  }

  throw new Error('This backup contains an unsupported TripDNA storage key: "' + key + '".');
}

export function parseBackup(text) {
  if (typeof text !== "string") throw new Error("Choose a valid TripDNA backup file.");
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) {
    throw new Error("This backup is larger than the 10 MB limit.");
  }

  let backup;
  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  if (!isPlainObject(backup) || backup.format !== BACKUP_FORMAT || backup.version !== BACKUP_VERSION) {
    throw new Error("This is not a supported TripDNA backup file.");
  }
  if (!isPlainObject(backup.data)) throw new Error("The backup does not contain a data section.");

  const entries = Object.entries(backup.data);
  if (entries.length > 100) throw new Error("The backup contains too many storage records.");

  for (const [key, value] of entries) {
    if (!isSupportedKey(key)) throw new Error('Unsupported backup item: "' + key + '".');
    validateEntry(key, value);
    const serialized = JSON.stringify(value);
    if (serialized.length > 2 * 1024 * 1024) {
      throw new Error('Backup item "' + key + '" is too large to restore safely.');
    }
  }

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: typeof backup.createdAt === "string" ? backup.createdAt : "",
    data: Object.fromEntries(entries),
  };
}

export function createBackup({ storage = globalThis.localStorage, now = () => new Date() } = {}) {
  if (!storage) throw new Error("Device storage is not available in this environment.");

  const data = {};
  for (const key of getSupportedKeys(storage)) {
    const raw = storage.getItem(key);
    if (raw === null) continue;

    let value;
    try {
      value = JSON.parse(raw);
    } catch {
      throw new Error('TripDNA could not export "' + key + '" because its saved data is damaged.');
    }
    validateEntry(key, value);
    data[key] = value;
  }

  const backup = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: now().toISOString(),
    data,
  };
  const serialized = JSON.stringify(backup, null, 2);
  if (new TextEncoder().encode(serialized).byteLength > MAX_BACKUP_BYTES) {
    throw new Error("Your backup is larger than the 10 MB limit. Export offline packs individually and try again.");
  }
  return backup;
}

export function restoreBackup(text, { storage = globalThis.localStorage } = {}) {
  if (!storage) throw new Error("Device storage is not available in this environment.");

  // Fully validate before touching the user's existing data.
  const backup = parseBackup(text);
  const oldKeys = getSupportedKeys(storage);
  const previous = new Map(oldKeys.map((key) => [key, storage.getItem(key)]));

  try {
    for (const key of oldKeys) storage.removeItem(key);
    for (const [key, value] of Object.entries(backup.data)) {
      storage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Best-effort rollback if the browser/WebView runs out of storage mid-restore.
    try {
      for (const key of getSupportedKeys(storage)) storage.removeItem(key);
      for (const [key, value] of previous) {
        if (value !== null) storage.setItem(key, value);
      }
    } catch {
      // A storage quota failure can also prevent rollback; report this clearly below.
    }
    throw new Error("TripDNA could not restore this backup because device storage is unavailable or full. Free some space and try again.");
  }

  return {
    createdAt: backup.createdAt,
    restoredKeys: Object.keys(backup.data).length,
    restoredTrips: Array.isArray(backup.data.savedTrips) ? backup.data.savedTrips.length : 0,
    restoredFavorites: Array.isArray(backup.data.favorites) ? backup.data.favorites.length : 0,
    restoredItineraries: Array.isArray(backup.data.tripDnaItineraries) ? backup.data.tripDnaItineraries.length : 0,
    restoredOfflinePacks: Array.isArray(backup.data.tripDnaOfflinePacks) ? backup.data.tripDnaOfflinePacks.length : 0,
  };
}
