import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import {
  deleteOfflinePack,
  exportOfflinePack,
  getOfflinePacks,
} from "../services/storage/offlinePacks";

function money(value) {
  return "₹" + Math.round(Number(value) || 0).toLocaleString("en-IN");
}

function OfflineTrips() {
  const [version, setVersion] = useState(0);
  const packs = getOfflinePacks();

  function refresh() {
    setVersion((value) => value + 1);
  }

  function handleDelete(id) {
    if (deleteOfflinePack(id)) refresh();
  }

  function handleExport(pack) {
    const exported = exportOfflinePack(pack);
    if (!exported) window.alert("Could not export this offline pack. Please try again.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white" data-version={version}>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Phase 3 · APK readiness</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Offline Travel Packs</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            Open saved route details, itineraries, budget settings, and expense records without making a live API request. Packs are stored in this browser or app WebView.
          </p>
          <p className="mt-2 text-sm text-amber-200">
            Offline snapshots can become stale. Live weather, opening hours, prices, and place availability are not refreshed here.
          </p>
        </header>

        {packs.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center sm:p-12">
            <div className="text-5xl">🧳</div>
            <h2 className="mt-4 text-2xl font-bold">No offline packs yet</h2>
            <p className="mx-auto mt-2 max-w-xl leading-6 text-slate-400">
              Search for a route and generate an itinerary, then choose “Save offline pack” in the AI Trip Planner. Up to eight routes can be kept on this device.
            </p>
            <a href="/" className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-3 font-extrabold text-slate-950 hover:bg-cyan-200">Plan a trip</a>
          </section>
        ) : (
          <div className="space-y-5">
            {packs.map((pack) => (
              <article key={pack.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <header className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Saved {new Date(pack.savedAt).toLocaleString()}</p>
                    <h2 className="mt-2 break-words text-2xl font-black">{pack.from} <span className="text-cyan-300">→</span> {pack.to}</h2>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-300">
                      {pack.route?.distance != null && <span className="rounded-full bg-white/5 px-3 py-1">{Number(pack.route.distance).toFixed(1)} km</span>}
                      {pack.route?.duration != null && <span className="rounded-full bg-white/5 px-3 py-1">{Number(pack.route.duration).toFixed(1)} hrs</span>}
                      {pack.itinerary?.days && <span className="rounded-full bg-white/5 px-3 py-1">{pack.itinerary.days.length} itinerary days</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleExport(pack)} className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-extrabold text-slate-950 hover:bg-cyan-200">Export JSON</button>
                    <button type="button" onClick={() => handleDelete(pack.id)} className="rounded-lg border border-red-300/20 px-4 py-2.5 text-sm font-bold text-red-200 hover:bg-red-500/10">Remove</button>
                  </div>
                </header>

                <div className="grid gap-4 p-5 md:grid-cols-2 sm:p-6">
                  <section className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                    <h3 className="font-bold">🗓️ Itinerary</h3>
                    {!pack.itinerary ? (
                      <p className="mt-2 text-sm text-slate-400">No saved day-by-day itinerary for this route.</p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {pack.itinerary.days.map((day) => (
                          <details key={day.day} className="rounded-lg border border-white/10 p-3" open={day.day === 1}>
                            <summary className="cursor-pointer font-semibold">Day {day.day}{day.date ? " · " + day.date : ""} — {day.title}</summary>
                            <div className="mt-3 space-y-3">
                              {day.activities.map((activity) => (
                                <div key={activity.id} className="border-l-2 border-cyan-300/50 pl-3">
                                  <p className="text-xs font-bold text-cyan-200">{activity.time || "Time flexible"} · {money(activity.estimatedCost)}</p>
                                  <p className="mt-1 font-semibold">{activity.title}</p>
                                  {activity.location && <p className="text-sm text-slate-400">{activity.location}</p>}
                                  {activity.description && <p className="mt-1 text-sm leading-5 text-slate-300">{activity.description}</p>}
                                </div>
                              ))}
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                    <h3 className="font-bold">💰 Budget and places</h3>
                    {pack.budget?.settings ? (
                      <div className="mt-3 space-y-1 text-sm text-slate-300">
                        <p>Travelers: {pack.budget.settings.travelers}</p>
                        <p>Hotel nights: {pack.budget.settings.nights}</p>
                        <p>Food per person/day: {money(pack.budget.settings.foodPerPersonPerDay)}</p>
                        <p>Actual expenses recorded: {pack.budget.expenses.length}</p>
                        <p>Total logged: {money(pack.budget.expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0))}</p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-400">No customized budget saved for this route yet.</p>
                    )}

                    {pack.destination && (
                      <div className="mt-4 space-y-3">
                        {[
                          ["Hotels", pack.destination.hotels],
                          ["Restaurants", pack.destination.restaurants],
                          ["Attractions", pack.destination.attractions],
                          ["Hospitals", pack.destination.hospitals],
                          ["Pharmacies", pack.destination.pharmacies],
                          ["Petrol pumps", pack.destination.petrolPumps],
                        ].filter(([, places]) => places?.length).map(([label, places]) => (
                          <div key={label}>
                            <p className="text-sm font-semibold text-cyan-200">{label}</p>
                            <ul className="mt-1 space-y-1 text-sm text-slate-300">
                              {places.slice(0, 6).map((place, index) => <li key={place.name + "-" + index}>{place.name}{place.address ? " — " + place.address : ""}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
                <p className="px-5 pb-5 text-xs leading-5 text-slate-500 sm:px-6">{pack.note}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default OfflineTrips;
