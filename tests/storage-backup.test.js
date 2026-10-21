import test from "node:test";
import assert from "node:assert/strict";
import {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  createBackup,
  parseBackup,
  restoreBackup,
} from "../src/services/storage/backup.js";

class MemoryStorage {
  values = new Map();

  get length() { return this.values.size; }

  key(index) {
    return [...this.values.keys()][index] ?? null;
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(String(key), String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

test("backup exports supported TripDNA data but ignores unrelated browser storage", () => {
  const storage = new MemoryStorage();
  storage.setItem("savedTrips", JSON.stringify([{ from: "Rewari", to: "Jaipur" }]));
  storage.setItem("tripDnaBudget:rewari|jaipur", JSON.stringify({ settings: {}, expenses: [] }));
  storage.setItem("unrelated-app-key", "do not export");

  const backup = createBackup({ storage, now: () => new Date("2026-10-21T00:00:00.000Z") });

  assert.equal(backup.format, BACKUP_FORMAT);
  assert.equal(backup.version, BACKUP_VERSION);
  assert.deepEqual(Object.keys(backup.data).sort(), ["savedTrips", "tripDnaBudget:rewari|jaipur"]);
  assert.equal(backup.createdAt, "2026-10-21T00:00:00.000Z");
});

test("restore replaces TripDNA data and preserves unrelated browser storage", () => {
  const storage = new MemoryStorage();
  storage.setItem("savedTrips", JSON.stringify([{ from: "Old", to: "Trip" }]));
  storage.setItem("tripDnaBudget:old|trip", JSON.stringify({ settings: {}, expenses: [] }));
  storage.setItem("unrelated-app-key", "leave untouched");

  const backup = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: "2026-10-21T00:00:00.000Z",
    data: {
      savedTrips: [{ from: "Rewari", to: "Delhi" }],
      favorites: [{ name: "Museum" }],
      "tripDnaBudget:rewari|delhi": { settings: { travelers: 2 }, expenses: [] },
    },
  };
  const result = restoreBackup(JSON.stringify(backup), { storage });

  assert.equal(result.restoredTrips, 1);
  assert.equal(result.restoredFavorites, 1);
  assert.equal(storage.getItem("tripDnaBudget:old|trip"), null);
  assert.equal(storage.getItem("unrelated-app-key"), "leave untouched");
  assert.deepEqual(JSON.parse(storage.getItem("savedTrips")), [{ from: "Rewari", to: "Delhi" }]);
});

test("invalid or unsupported backup is rejected before stored data changes", () => {
  const storage = new MemoryStorage();
  storage.setItem("savedTrips", JSON.stringify([{ from: "Keep", to: "This" }]));

  assert.throws(() => restoreBackup("{bad json", { storage }), /valid JSON/);
  assert.throws(() => restoreBackup(JSON.stringify({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    data: { "some-other-app-key": { private: true } },
  }), { storage }), /Unsupported/);
  assert.deepEqual(JSON.parse(storage.getItem("savedTrips")), [{ from: "Keep", to: "This" }]);
});

test("backup schema rejects oversized collections and invalid budget records", () => {
  assert.throws(() => parseBackup(JSON.stringify({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    data: { savedTrips: Array.from({ length: 21 }, () => ({ from: "A", to: "B" })) },
  })), /supported limit/);
  assert.throws(() => parseBackup(JSON.stringify({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    data: { "tripDnaBudget:a|b": { expenses: [] } },
  })), /settings or its expense list/);
});
