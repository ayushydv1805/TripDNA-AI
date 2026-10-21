import { useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { createBackup, MAX_BACKUP_BYTES, restoreBackup } from "../services/storage/backup";

function BackupRestore() {
  const fileInput = useRef(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [restored, setRestored] = useState(false);

  function downloadBackup() {
    setStatus(null);
    try {
      const backup = createBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      anchor.href = url;
      anchor.download = "TripDNA-backup-" + date + ".json";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus({
        type: "success",
        message: "Your backup file has been created. Keep it somewhere safe; it may contain your saved routes, favorites, itineraries and expense notes.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "TripDNA could not create a backup." });
    }
  }

  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus(null);
    setRestored(false);

    if (file.size > MAX_BACKUP_BYTES) {
      setStatus({ type: "error", message: "This file is larger than the 10 MB limit." });
      event.target.value = "";
      return;
    }

    setBusy(true);
    try {
      const contents = await file.text();
      if (!window.confirm("Restore this TripDNA backup? It will replace TripDNA data stored on this device. Export the current data first if you need to keep it. Your Firebase cloud account is not changed.")) {
        return;
      }
      const summary = restoreBackup(contents);
      setRestored(true);
      setStatus({
        type: "success",
        message: "Backup restored. " + summary.restoredTrips + " saved trips, " +
          summary.restoredFavorites + " favorites, " + summary.restoredItineraries +
          " itineraries and " + summary.restoredOfflinePacks + " offline packs are now stored on this device.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "TripDNA could not restore this backup." });
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">Your data, in your control</p>
          <h1 className="mt-2 text-4xl font-black md:text-5xl">Backup & Restore</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Make a portable backup before changing browsers, reinstalling the app or moving to another device.
            This feature works even when you are using TripDNA without a cloud account.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <div className="text-4xl" aria-hidden="true">📤</div>
            <h2 className="mt-4 text-2xl font-bold">Export your data</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Download one JSON file containing your saved trips, favorites, recent searches, cached route snapshots,
              editable itineraries, offline packs and route budget/expense records.
            </p>
            <button type="button" onClick={downloadBackup} className="mt-6 rounded-xl bg-cyan-300 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-cyan-200">
              Download backup
            </button>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <div className="text-4xl" aria-hidden="true">📥</div>
            <h2 className="mt-4 text-2xl font-bold">Restore a backup</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Restore a TripDNA backup on this device. The file is validated before any saved data is changed, and unrelated
              websites' browser storage is left untouched. Your Firebase cloud data is not overwritten.
            </p>
            <input
              ref={fileInput}
              type="file"
              accept=".json,application/json"
              onChange={importBackup}
              disabled={busy}
              className="mt-6 block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:font-bold file:text-slate-950"
            />
            <p className="mt-3 text-xs leading-5 text-slate-500">Only TripDNA backup files up to 10 MB are accepted. Restore replaces TripDNA data saved on this device.</p>
          </section>
        </div>

        {status && (
          <section role={status.type === "error" ? "alert" : "status"} className={"mt-6 rounded-2xl border p-5 " + (status.type === "error" ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100")}>
            <p className="font-semibold">{status.message}</p>
            {restored && (
              <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg border border-white/20 px-4 py-2 font-bold hover:bg-white/10">
                Reload TripDNA
              </button>
            )}
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-sm leading-6 text-amber-100/90">
          <h2 className="font-bold">Important privacy note</h2>
          <p className="mt-2">A backup can contain destination history, travel plans and expense descriptions. Store the file privately and do not share it publicly. Cloud-synced trips and favorites remain in your Firebase account and are not changed by importing or exporting a local backup.</p>
        </section>
      </main>
    </div>
  );
}

export default BackupRestore;
