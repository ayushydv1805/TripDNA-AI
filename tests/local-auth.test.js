import test from "node:test";
import assert from "node:assert/strict";
import {
  createLocalAccount,
  getLocalSession,
  signInLocalAccount,
  signOutLocalAccount,
} from "../src/services/auth/localAuth.js";

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(String(key), String(value));
  }

  removeItem(key) {
    this.values.delete(String(key));
  }
}

test("local profile can be created, signed into, and signed out of without Firebase", async () => {
  const previousWindow = globalThis.window;
  const storage = new MemoryStorage();
  globalThis.window = { localStorage: storage };

  try {
    const details = {
      name: "Test Traveler",
      email: "Trip.Test@example.com",
      password: "correct-horse-battery",
    };

    const created = await createLocalAccount(details);
    assert.equal(created.email, "trip.test@example.com");
    assert.equal(created.displayName, "Test Traveler");
    assert.equal(created.isLocalAccount, true);
    assert.equal(getLocalSession().uid, created.uid);

    const savedRecords = JSON.parse(storage.getItem("tripdna.localAccounts.v1"));
    assert.equal(savedRecords.length, 1);
    assert.notEqual(savedRecords[0].passwordHash, details.password);
    assert.ok(savedRecords[0].salt);

    signOutLocalAccount();
    assert.equal(getLocalSession(), null);

    const signedIn = await signInLocalAccount({
      email: "TRIP.TEST@example.com",
      password: details.password,
    });
    assert.equal(signedIn.uid, created.uid);
    assert.equal(getLocalSession().email, "trip.test@example.com");

    signOutLocalAccount();
    assert.equal(getLocalSession(), null);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test("local profile rejects duplicate emails and incorrect passwords", async () => {
  const previousWindow = globalThis.window;
  globalThis.window = { localStorage: new MemoryStorage() };

  try {
    await createLocalAccount({
      name: "Test Traveler",
      email: "traveler@example.com",
      password: "strong-password-1",
    });

    await assert.rejects(
      createLocalAccount({
        name: "Another Traveler",
        email: "TRAVELER@example.com",
        password: "strong-password-2",
      }),
      /already exists/i
    );

    await assert.rejects(
      signInLocalAccount({
        email: "traveler@example.com",
        password: "wrong-password",
      }),
      /incorrect/i
    );

    await assert.rejects(
      signInLocalAccount({
        email: "missing@example.com",
        password: "strong-password-1",
      }),
      /no local profile/i
    );
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
