import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-5 py-4 text-white backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)} className="text-2xl font-black text-cyan-400 transition hover:text-cyan-300 md:text-3xl">
          🌍 TripDNA AI
        </Link>

        <div className="hidden items-center gap-7 text-base md:flex">
          <Link to="/" className="transition hover:text-cyan-400">🏠 Home</Link>
          <Link to="/saved" className="transition hover:text-cyan-400">💾 Saved Trips</Link>
          <Link to="/favorites" className="transition hover:text-cyan-400">❤️ Favorites</Link>
          <Link to="/profile" className="transition hover:text-cyan-400">👤 Profile</Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-lg md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-4 md:hidden">
          <Link onClick={() => setOpen(false)} to="/" className="rounded-lg px-3 py-3 hover:bg-white/5">🏠 Home</Link>
          <Link onClick={() => setOpen(false)} to="/saved" className="rounded-lg px-3 py-3 hover:bg-white/5">💾 Saved Trips</Link>
          <Link onClick={() => setOpen(false)} to="/favorites" className="rounded-lg px-3 py-3 hover:bg-white/5">❤️ Favorites</Link>
          <Link onClick={() => setOpen(false)} to="/profile" className="rounded-lg px-3 py-3 hover:bg-white/5">👤 Profile</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
