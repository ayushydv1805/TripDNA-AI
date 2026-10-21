import test from "node:test";
import assert from "node:assert/strict";
import { isJsonRequest, secureApiRequest } from "../server/apiSecurity.js";

function makeResponse() {
  const headers = new Map();
  return {
    headers,
    statusCode: 200,
    payload: null,
    setHeader(name, value) { headers.set(name.toLowerCase(), value); },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.payload = value;
      return this;
    },
  };
}

test("native Android WebView origin gets narrowly scoped CORS headers", () => {
  const req = { headers: { origin: "https://localhost" } };
  const res = makeResponse();

  assert.equal(secureApiRequest(req, res), true);
  assert.equal(res.headers.get("access-control-allow-origin"), "https://localhost");
  assert.equal(res.headers.get("access-control-allow-methods"), "POST, OPTIONS");
  assert.equal(res.headers.get("access-control-allow-headers"), "Content-Type");
  assert.equal(res.headers.get("cache-control"), "no-store, max-age=0");
});

test("Capacitor custom-scheme origin is accepted", () => {
  const req = { headers: { origin: "capacitor://localhost" } };
  const res = makeResponse();

  assert.equal(secureApiRequest(req, res), true);
  assert.equal(res.headers.get("access-control-allow-origin"), "capacitor://localhost");
});

test("unrecognized browser origin is rejected", () => {
  const req = { headers: { origin: "https://not-tripdna.example" } };
  const res = makeResponse();

  assert.equal(secureApiRequest(req, res), false);
  assert.equal(res.statusCode, 403);
  assert.match(res.payload.error, /origin is not allowed/i);
});

test("non-browser requests without an Origin header remain supported", () => {
  const req = { headers: {} };
  const res = makeResponse();
  assert.equal(secureApiRequest(req, res), true);
});

test("JSON content type validation supports charset parameters", () => {
  assert.equal(isJsonRequest({ headers: { "content-type": "application/json; charset=utf-8" } }), true);
  assert.equal(isJsonRequest({ headers: { "content-type": "Application/JSON" } }), true);
  assert.equal(isJsonRequest({ headers: { "content-type": "text/plain" } }), false);
  assert.equal(isJsonRequest({ headers: {} }), false);
});
