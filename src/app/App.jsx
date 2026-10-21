import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

const Home = lazy(() => import("../pages/Home"));
const Search = lazy(() => import("../pages/Search"));
const TripDetails = lazy(() => import("../pages/TripDetails"));
const SavedTrips = lazy(() => import("../pages/SavedTrips"));
const Profile = lazy(() => import("../pages/Profile"));
const Favorites = lazy(() => import("../pages/Favorites"));
const Login = lazy(() => import("../pages/Login"));
const OfflineTrips = lazy(() => import("../pages/OfflineTrips"));
const BackupRestore = lazy(() => import("../pages/BackupRestore"));
const NotFound = lazy(() => import("../pages/NotFound"));

function RouteLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div role="status" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
        <p className="font-semibold">Loading TripDNA…</p>
        <p className="mt-1 text-sm text-slate-400">Preparing your travel tools</p>
      </div>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/saved" element={<SavedTrips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/offline" element={<OfflineTrips />} />
            <Route path="/backup" element={<BackupRestore />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
