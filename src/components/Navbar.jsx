import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-slate-900 text-white shadow-lg">

      <Link
        to="/"
        className="text-3xl font-bold text-cyan-400 hover:text-cyan-300"
      >
        🌍 TripDNA AI
      </Link>

      <div className="hidden md:flex gap-8 text-lg">

        <Link
          to="/"
          className="hover:text-cyan-400 transition"
        >
          🏠 Home
        </Link>

        <Link
          to="/saved"
          className="hover:text-cyan-400 transition"
        >
          💾 Saved Trips
        </Link>

        <Link
          to="/favorites"
          className="hover:text-cyan-400 transition"
        >
          ❤️ Favorites
        </Link>

        <Link
          to="/profile"
          className="hover:text-cyan-400 transition"
        >
          👤 Profile
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;