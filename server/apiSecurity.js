function normalizeOrigin(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const input = value.trim();
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : "https://" + input);
    return url.origin === "null" ? url.protocol + "//" + url.host : url.origin;
  } catch {
    return null;
  }
}

// Origin checks reduce cross-site browser abuse; they are not a substitute for
// provider-side quotas or server-side rate limiting.
export function secureApiRequest(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const requestOrigin = req.headers?.origin;
  // Non-browser clients may omit Origin. They are still subject to validation and
  // upstream provider quotas, so don't treat this check as authentication.
  if (!requestOrigin) return true;

  const allowedOrigins = new Set([
    "https://trip-dna-ai.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    // Capacitor Android WebView and Tauri desktop WebView origins.
    "https://localhost",
    "capacitor://localhost",
    "tauri://localhost",
    "http://tauri.localhost",
    "https://tauri.localhost",
  ]);

  for (const value of [
    process.env.VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ...(process.env.TRIPDNA_ALLOWED_ORIGINS || "").split(","),
  ]) {
    const origin = normalizeOrigin(value);
    if (origin) allowedOrigins.add(origin);
  }

  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
  if (normalizedRequestOrigin && allowedOrigins.has(normalizedRequestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "600");
    res.setHeader("Vary", "Origin");
    return true;
  }

  res.status(403).json({ error: "This request origin is not allowed." });
  return false;
}

export function isJsonRequest(req) {
  const contentType = req.headers?.["content-type"];
  return typeof contentType === "string" &&
    contentType.toLowerCase().split(";")[0].trim() === "application/json";
}
