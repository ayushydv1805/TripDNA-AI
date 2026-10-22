import { useState } from "react";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, firebaseConfigured } from "../lib/firebase";
import { useAuth } from "../app/useAuth";

function friendlyAuthError(code) {
  const messages = {
    "auth/invalid-email": "Enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account was found for this email. Create an account first.",
    "auth/wrong-password": "The email or password is incorrect.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/email-already-in-use": "An account already exists for this email. Sign in instead.",
    "auth/weak-password": "Choose a password with at least 8 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait a little and try again.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/operation-not-allowed": "Enable Email/Password sign-in in your Firebase console.",
  };
  return messages[code] || "We could not complete that request. Please try again.";
}

function Login() {
  const { user, loading, logout, createLocalProfile, signInLocal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const returnTo = location.state?.from || "/profile";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (mode === "create" && name.trim().length < 2) {
      setError("Enter your name (at least 2 characters).");
      return;
    }
    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      if (!firebaseConfigured || !auth) {
        if (mode === "create") {
          await createLocalProfile({ name, email, password });
        } else {
          await signInLocal({ email, password });
        }
      } else {
        await setPersistence(auth, browserLocalPersistence);
        if (mode === "create") {
          const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
          if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
        } else {
          await signInWithEmailAndPassword(auth, email.trim(), password);
        }
      }
      navigate(returnTo, { replace: true });
    } catch (authError) {
      setError(authError?.code ? friendlyAuthError(authError.code) : authError?.message || "We could not complete that request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordReset() {
    setError("");
    setNotice("");
    if (!firebaseConfigured || !auth) {
      setError("Add Firebase settings before using password reset.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email first, then choose “Forgot password?”.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setNotice("Password reset email sent. Check your inbox and spam folder.");
    } catch (authError) {
      setError(friendlyAuthError(authError?.code));
    }
  }

  async function handleSignOut() {
    try {
      await logout();
    } catch {
      setError("We could not sign you out. Please try again.");
    }
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white"><p className="text-cyan-300">Loading your TripDNA account…</p></main>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-black px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <Link to="/" className="text-sm font-bold text-cyan-300 hover:text-cyan-200">← Back to TripDNA</Link>
        <div className="mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Your journeys, saved</p>
          <h1 className="mt-2 text-3xl font-black">{user ? "Your account" : mode === "create" ? "Create account" : "Welcome back"}</h1>
          <p className="mt-3 leading-6 text-slate-300">{firebaseConfigured ? "Sign in to back up your trips, search history and favorite places across devices." : "Create a local profile to sign in on this PC. Your saved trips stay on this device."}</p>
        </div>

        {user ? (
          <div className="mt-7 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-5">
            <p className="font-semibold">{user.displayName || "You're signed in"}</p>
            <p className="mt-1 break-all text-sm text-slate-300">{user.email}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/profile" className="rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-950">Open profile</Link>
              <button type="button" onClick={handleSignOut} className="rounded-xl border border-white/15 px-4 py-2 font-semibold hover:bg-white/5">Sign out</button>
            </div>
          </div>
        ) : (
          <>
            {!firebaseConfigured && <div className="mt-6 rounded-xl border border-amber-300/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100"><strong>Local account mode:</strong> this desktop build does not include Firebase cloud-login settings, so you can create a profile saved on this PC. It will not sign you into an existing Firebase account or sync this profile to other devices. Cloud login can be enabled once the Firebase project configuration is added to the release build.</div>}
            <div className="mt-6 grid grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1">
              <button type="button" onClick={() => { setMode("signin"); setError(""); setNotice(""); }} className={"rounded-lg px-3 py-2 text-sm font-bold " + (mode === "signin" ? "bg-cyan-300 text-slate-950" : "text-slate-300")}>{firebaseConfigured ? "Sign in" : "Sign in on this PC"}</button>
              <button type="button" onClick={() => { setMode("create"); setError(""); setNotice(""); }} className={"rounded-lg px-3 py-2 text-sm font-bold " + (mode === "create" ? "bg-cyan-300 text-slate-950" : "text-slate-300")}>{firebaseConfigured ? "Create account" : "Create local profile"}</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "create" && <label className="block text-sm font-semibold text-slate-200">Full name<input name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={80} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300" placeholder="Your name" /></label>}
              <label className="block text-sm font-semibold text-slate-200">Email address<input name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300" placeholder="you@example.com" /></label>
              <label className="block text-sm font-semibold text-slate-200">Password<input name="password" type="password" autoComplete={mode === "create" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} maxLength={128} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300" placeholder="At least 8 characters" /></label>
              {mode === "signin" && <div className="text-right"><button type="button" onClick={handlePasswordReset} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">Forgot password?</button></div>}{mode === "signin" && !firebaseConfigured && <p className="text-right text-xs leading-5 text-slate-400">Local profiles are stored only on this PC. If you forget the password, this local profile cannot be recovered.</p>}
              {error && <p role="alert" className="rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm leading-5 text-red-200">{error}</p>}
              {notice && <p role="status" className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 p-3 text-sm leading-5 text-emerald-100">{notice}</p>}
              <button type="submit" disabled={busy} className="w-full rounded-xl bg-cyan-300 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Please wait…" : mode === "create" ? (firebaseConfigured ? "Create account" : "Create local profile") : (firebaseConfigured ? "Sign in" : "Sign in on this PC")}</button>
            </form>
          </>
        )}

        {!user && <p className="mt-6 text-center text-sm leading-6 text-slate-400">Prefer not to sign in? <Link to="/" className="font-bold text-cyan-300 hover:text-cyan-200">Continue as guest</Link>. Your searches and trip snapshots will still be saved on this device.</p>}
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">Keep Firebase web config in deployment settings. Never put a service-account key in the frontend.</p>
      </section>
    </main>
  );
}

export default Login;
