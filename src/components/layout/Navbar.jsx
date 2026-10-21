import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/useAuth";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { user, logout } = useAuth();

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error("TripDNA sign-out failed:", error);
      setLogoutError("Could not sign out. Please try again.");
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-5 py-4 text-white backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" onClick={() => setOpen(false)} className="shrink-0 text-2xl font-black text-cyan-400 transition hover:text-cyan-300 md:text-3xl">🌍 TripDNA AI</Link>
        <div className="hidden items-center gap-5 text-sm lg:flex">
          <Link to="/" className="transition hover:text-cyan-400">🏠 Home</Link>
          <Link to="/saved" className="transition hover:text-cyan-400">💾 Saved Trips</Link>
          <Link to="/offline" className="transition hover:text-cyan-400">📦 Offline Packs</Link>
          <Link to="/favorites" className="transition hover:text-cyan-400">❤️ Favorites</Link>
          <Link to="/profile" className="transition hover:text-cyan-400">👤 Profile</Link>
          {user ? (
            <>
              <span title={user.email || ""} className="max-w-36 truncate text-slate-400">{user.displayName || user.email}</span>
              <button type="button" onClick={handleLogout} className="rounded-lg border border-white/15 px-3 py-2 font-semibold transition hover:border-cyan-300/40 hover:text-cyan-300">Sign out</button>
            </>
          ) : (
            <Link to="/login" className="rounded-lg bg-cyan-300 px-4 py-2 font-bold text-slate-950 transition hover:bg-cyan-200">Sign in</Link>
          )}
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-lg lg:hidden" aria-label="Toggle navigation menu" aria-expanded={open}>
          {open ? "✕" : "☰"}
        </button>
      </div>
      {logoutError && <p role="alert" className="mx-auto mt-3 max-w-7xl text-sm text-red-300">{logoutError}</p>}
      {open && (
        <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-4 lg:hidden">
          <Link onClick={() => setOpen(false)} to="/" className="rounded-lg px-3 py-3 hover:bg-white/5">🏠 Home</Link>
          <Link onClick={() => setOpen(false)} to="/saved" className="rounded-lg px-3 py-3 hover:bg-white/5">💾 Saved Trips</Link>
          <Link onClick={() => setOpen(false)} to="/offline" className="rounded-lg px-3 py-3 hover:bg-white/5">📦 Offline Packs</Link>
          <Link onClick={() => setOpen(false)} to="/favorites" className="rounded-lg px-3 py-3 hover:bg-white/5">❤️ Favorites</Link>
          <Link onClick={() => setOpen(false)} to="/profile" className="rounded-lg px-3 py-3 hover:bg-white/5">👤 Profile</Link>
          {user ? (
            <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-3 text-left font-semibold text-cyan-300 hover:bg-white/5">Sign out ({user.displayName || user.email})</button>
          ) : (
            <Link onClick={() => setOpen(false)} to="/login" className="rounded-lg px-3 py-3 font-bold text-cyan-300 hover:bg-white/5">🔐 Sign in / Create account</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
