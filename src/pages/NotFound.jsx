import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-16">
        <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 md:p-14 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-300/20 text-4xl">
            🧭
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300 mb-4">
            Route not found
          </p>

          <div className="flex items-end justify-center gap-2 mb-4 select-none">
            <span className="text-7xl md:text-9xl font-black text-white/30 -rotate-6">4</span>
            <span className="text-7xl md:text-9xl font-black text-cyan-400">0</span>
            <span className="text-7xl md:text-9xl font-black text-white/30 rotate-6">4</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-4">
            This destination doesn't exist
          </h1>

          <p className="mx-auto max-w-2xl text-base md:text-lg text-slate-300 leading-8 mb-8">
            The page you&apos;re looking for may have moved, or the link may be incomplete.
            Head back to TripDNA AI and start planning your next journey.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300 hover:-translate-y-0.5"
          >
            🏠 Back to Home
          </Link>

          <p className="mt-6 text-sm text-slate-500">
            Error 404 · Page not found
          </p>
        </section>
      </main>
    </div>
  );
}

export default NotFound;
