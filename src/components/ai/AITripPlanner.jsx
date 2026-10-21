import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  generateTripPlan,
  regenerateTripDay,
} from "../../services/ai/tripPlan";
import {
  getSavedItinerary,
  itineraryToText,
  saveItinerary,
} from "../../services/storage/itineraries";
import { saveOfflinePack } from "../../services/storage/offlinePacks";

function localISODate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function inclusiveDays(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
  return Math.min(30, Math.max(1, diff + 1));
}

function formatMoney(value) {
  return "₹" + Math.round(Number(value) || 0).toLocaleString("en-IN");
}

function uniqueActivityId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "activity-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function AITripPlanner({ from, to }) {
  const [initialPlan] = useState(() => getSavedItinerary(from, to));
  const [startDate, setStartDate] = useState(() => initialPlan?.startDate || localISODate(1));
  const [endDate, setEndDate] = useState(() => initialPlan?.endDate || localISODate(3));
  const [budget, setBudget] = useState(() => initialPlan?.budget ?? 15000);
  const [travelers, setTravelers] = useState(() => initialPlan?.travelers || 2);
  const [tripType, setTripType] = useState(() => initialPlan?.tripType || "Adventure");
  const [travelStyle, setTravelStyle] = useState(() => initialPlan?.travelStyle || "Balanced");
  const [foodPreference, setFoodPreference] = useState(() => initialPlan?.foodPreference || "No preference");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [regeneratingDay, setRegeneratingDay] = useState(0);
  const [tripPlan, setTripPlan] = useState(initialPlan);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const days = inclusiveDays(startDate, endDate);
  const options = useMemo(() => ({
    days,
    budget: Number(budget),
    travelers: Number(travelers),
    startDate,
    endDate,
    tripType,
    travelStyle,
    foodPreference,
    interests,
  }), [days, budget, travelers, startDate, endDate, tripType, travelStyle, foodPreference, interests]);

  const estimatedActivityCost = useMemo(() => {
    if (!Array.isArray(tripPlan?.days)) return 0;
    return tripPlan.days.reduce(
      (sum, day) => sum + (Array.isArray(day.activities)
        ? day.activities.reduce((daySum, activity) => daySum + (Number(activity.estimatedCost) || 0), 0)
        : 0),
      0
    );
  }, [tripPlan]);

  useEffect(() => {
    if (tripPlan && Array.isArray(tripPlan.days)) {
      saveItinerary(from, to, tripPlan);
    }
  }, [from, to, tripPlan]);

  async function handleGenerate() {
    const safeBudget = Number(budget);
    const safeTravelers = Number(travelers);
    if (!from?.trim() || !to?.trim()) {
      setError("A starting location and destination are required.");
      return;
    }
    if (!Number.isFinite(safeBudget) || safeBudget < 0 || safeBudget > 100000000) {
      setError("Enter a valid total budget up to ₹10 crore.");
      return;
    }
    if (!Number.isInteger(safeTravelers) || safeTravelers < 1 || safeTravelers > 30) {
      setError("Choose between 1 and 30 travelers.");
      return;
    }
    if (endDate < startDate) {
      setError("Return date cannot be before the start date.");
      return;
    }

    setError("");
    setNotice("");
    setLoading(true);
    try {
      const plan = await generateTripPlan(from, to, options);
      if (!Array.isArray(plan.days) || plan.days.length !== days) {
        throw new Error("The planner returned an incomplete itinerary. Please try again.");
      }
      setTripPlan(plan);
      setNotice("Your itinerary is ready. Edits are saved on this device automatically.");
    } catch (generationError) {
      console.error("AI itinerary error:", generationError);
      setError(generationError instanceof Error ? generationError.message : "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  }

  function updateDay(dayNumber, updater) {
    setTripPlan((current) => {
      if (!current || !Array.isArray(current.days)) return current;
      return {
        ...current,
        days: current.days.map((day) => Number(day.day) === Number(dayNumber) ? updater(day) : day),
      };
    });
    setNotice("Changes are saved on this device automatically.");
  }

  function updateActivity(dayNumber, activityId, field, value) {
    updateDay(dayNumber, (day) => ({
      ...day,
      activities: day.activities.map((activity) =>
        activity.id === activityId ? { ...activity, [field]: field === "estimatedCost" || field === "durationMinutes" ? Math.max(0, Number(value) || 0) : value } : activity
      ),
    }));
  }

  function moveActivity(dayNumber, index, direction) {
    updateDay(dayNumber, (day) => {
      const activities = [...day.activities];
      const target = index + direction;
      if (target < 0 || target >= activities.length) return day;
      [activities[index], activities[target]] = [activities[target], activities[index]];
      return { ...day, activities };
    });
  }

  function addActivity(dayNumber) {
    updateDay(dayNumber, (day) => ({
      ...day,
      activities: [...day.activities, {
        id: uniqueActivityId(),
        time: "18:00",
        title: "New activity",
        location: to,
        description: "Add your own notes for this stop.",
        durationMinutes: 60,
        estimatedCost: 0,
        category: "Custom",
      }],
    }));
  }

  function removeActivity(dayNumber, activityId) {
    updateDay(dayNumber, (day) => ({
      ...day,
      activities: day.activities.filter((activity) => activity.id !== activityId),
    }));
  }

  function handleSaveOfflinePack() {
    if (!tripPlan) return;
    const itinerarySaved = saveItinerary(from, to, tripPlan);
    if (!itinerarySaved) {
      setError("Could not save the itinerary before creating the offline pack.");
      return;
    }
    const result = saveOfflinePack(from, to);
    if (!result.ok) {
      setError(result.error || "Could not save this offline pack.");
      return;
    }
    setError("");
    setNotice("Offline pack saved. Open Offline Trips from the navigation menu to view it without live API calls.");
  }

  async function handleRegenerateDay(dayNumber) {
    if (!tripPlan) return;
    setError("");
    setRegeneratingDay(dayNumber);
    try {
      const replacement = await regenerateTripDay(from, to, options, tripPlan, dayNumber);
      if (!Array.isArray(replacement.activities) || replacement.activities.length === 0) {
        throw new Error("The new day plan was incomplete. Please try again.");
      }
      updateDay(dayNumber, () => replacement);
      setNotice("Day " + dayNumber + " has been regenerated. Other days were kept unchanged.");
    } catch (generationError) {
      console.error("Day regeneration error:", generationError);
      setError(generationError instanceof Error ? generationError.message : "Could not regenerate this day.");
    } finally {
      setRegeneratingDay(0);
    }
  }

  const plainText = () => itineraryToText(tripPlan, from, to, budget);

  async function copyItinerary() {
    if (!tripPlan) return;
    try {
      await navigator.clipboard.writeText(plainText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      setNotice("Itinerary copied to clipboard.");
    } catch (copyError) {
      console.error("Copy itinerary error:", copyError);
      setError("Could not copy the itinerary. Check clipboard permissions.");
    }
  }

  async function shareItinerary() {
    if (!tripPlan) return;
    if (!navigator.share) {
      setError("Sharing is not supported in this browser. Use Copy instead.");
      return;
    }
    try {
      await navigator.share({ title: tripPlan.title || "TripDNA AI Itinerary", text: plainText() });
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        console.error("Share itinerary error:", shareError);
        setError("Could not share the itinerary.");
      }
    }
  }

  function speakItinerary() {
    if (!tripPlan) return;
    if (!("speechSynthesis" in window)) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(plainText());
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
  }

  function downloadPDF() {
    if (!tripPlan) return;
    try {
      const pdf = new jsPDF();
      let y = 20;
      pdf.setFontSize(20);
      pdf.text("TripDNA AI - Travel Itinerary", 20, y);
      y += 14;
      pdf.setFontSize(10);
      const content = pdf.splitTextToSize(plainText(), 170);
      for (const line of content) {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 20, y);
        y += 5.5;
      }
      const safeFrom = String(from || "start").replace(/[^a-z0-9]/gi, "-");
      const safeTo = String(to || "destination").replace(/[^a-z0-9]/gi, "-");
      pdf.save("TripDNA-" + safeFrom + "-to-" + safeTo + "-itinerary.pdf");
    } catch (pdfError) {
      console.error("PDF export error:", pdfError);
      setError("PDF download failed.");
    }
  }

  return (
    <section className="my-6 rounded-2xl border border-white/10 bg-slate-800 p-5 sm:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Phase 1 · Itinerary builder</p>
        <h2 className="mt-1 text-2xl font-black">🤖 AI Day-by-Day Trip Planner</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Build a timed plan for each day, edit activities, change their order, add your own stops, or regenerate just one day.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-slate-300">Start date</span>
          <input type="date" value={startDate} min={localISODate(0)} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white" />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-slate-300">Return / final day</span>
          <input type="date" value={endDate} min={startDate || localISODate(0)} onChange={(event) => setEndDate(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white" />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-slate-300">Travelers</span>
          <input type="number" min="1" max="30" value={travelers} onChange={(event) => setTravelers(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white" />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-slate-300">Total budget for group (₹)</span>
          <input type="number" min="0" max="100000000" step="500" value={budget} onChange={(event) => setBudget(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white" />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-slate-300">Trip style</span>
          <select value={tripType} onChange={(event) => setTripType(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white">
            {["Adventure", "Family", "Solo", "Couple", "Relaxation", "Culture", "Food", "Nature", "Business", "Road trip"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-slate-300">Daily pace</span>
          <select value={travelStyle} onChange={(event) => setTravelStyle(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white">
            {["Relaxed", "Balanced", "Packed"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-slate-300">Food preference</span>
          <select value={foodPreference} onChange={(event) => setFoodPreference(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white">
            {["No preference", "Vegetarian", "Vegan", "Jain", "Halal", "Local food", "Budget food"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2 lg:col-span-2">
          <span className="font-semibold text-slate-300">Interests (optional)</span>
          <input type="text" maxLength="500" value={interests} onChange={(event) => setInterests(event.target.value)} placeholder="e.g. temples, scenic drives, cafes, easy hikes, photography" className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white placeholder:text-slate-500" />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-lg bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200">{days} day{days === 1 ? "" : "s"} · {travelers} traveler{Number(travelers) === 1 ? "" : "s"}</span>
        <button type="button" onClick={handleGenerate} disabled={loading || regeneratingDay > 0} className="rounded-xl bg-cyan-400 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Generating itinerary…" : tripPlan ? "Regenerate full itinerary" : "Generate AI itinerary"}
        </button>
      </div>

      {error && <div role="alert" className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">⚠️ {error}</div>}
      {notice && <div role="status" className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-400/5 p-4 text-sm leading-6 text-cyan-100">{notice}</div>}

      {tripPlan && (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-950/70 to-slate-900 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Your itinerary · saved locally</p>
            <h3 className="mt-2 text-2xl font-black">{tripPlan.title || (to + " itinerary")}</h3>
            {tripPlan.summary && <p className="mt-3 max-w-4xl leading-7 text-slate-300">{tripPlan.summary}</p>}
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
              <span className="rounded-full border border-white/10 px-3 py-1.5">{tripPlan.startDate || startDate} → {tripPlan.endDate || endDate}</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">{tripPlan.travelers || travelers} travelers</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">Group budget {formatMoney(budget)}</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">Activity estimate {formatMoney(estimatedActivityCost)}</span>
            </div>
          </div>

          {tripPlan.days.map((day) => (
            <article key={day.day} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Day {day.day}{day.date ? " · " + day.date : ""}</p>
                  <h4 className="mt-1 text-xl font-bold">{day.title || "Day " + day.day}</h4>
                  <p className="mt-1 text-sm text-slate-400">{day.activities.length} activities · {formatMoney(day.activities.reduce((sum, activity) => sum + (Number(activity.estimatedCost) || 0), 0))} estimated activity costs</p>
                </div>
                <button type="button" onClick={() => handleRegenerateDay(day.day)} disabled={loading || regeneratingDay > 0} className="rounded-lg border border-cyan-300/30 px-3 py-2 text-sm font-bold text-cyan-200 hover:bg-cyan-400/10 disabled:opacity-50">
                  {regeneratingDay === day.day ? "Regenerating…" : "↻ Regenerate this day"}
                </button>
              </header>

              <div className="space-y-3 p-4 sm:p-5">
                {day.activities.map((activity, index) => (
                  <div key={activity.id} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-md bg-cyan-300/10 px-2.5 py-1 text-xs font-bold text-cyan-200">{activity.time || "Time flexible"}</span>
                      <div className="flex flex-wrap items-center gap-1">
                        <button type="button" onClick={() => moveActivity(day.day, index, -1)} disabled={index === 0} aria-label="Move activity up" className="rounded-md border border-white/10 px-2 py-1 text-sm disabled:opacity-30">↑</button>
                        <button type="button" onClick={() => moveActivity(day.day, index, 1)} disabled={index === day.activities.length - 1} aria-label="Move activity down" className="rounded-md border border-white/10 px-2 py-1 text-sm disabled:opacity-30">↓</button>
                        <button type="button" onClick={() => removeActivity(day.day, activity.id)} aria-label={"Delete " + activity.title} className="rounded-md border border-red-300/20 px-2 py-1 text-sm text-red-300 hover:bg-red-500/10">Remove</button>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                      <label className="flex flex-col gap-1 text-xs font-semibold text-slate-400">Activity title<input maxLength="160" value={activity.title} onChange={(event) => updateActivity(day.day, activity.id, "title", event.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" /></label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-slate-400">Approx. cost (₹)<input type="number" min="0" max="10000000" value={activity.estimatedCost} onChange={(event) => updateActivity(day.day, activity.id, "estimatedCost", event.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" /></label>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-[150px_1fr]">
                      <label className="flex flex-col gap-1 text-xs font-semibold text-slate-400">Time<input type="time" value={/^\d{2}:\d{2}$/.test(activity.time || "") ? activity.time : ""} onChange={(event) => updateActivity(day.day, activity.id, "time", event.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" /></label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-slate-400">Location<input maxLength="160" value={activity.location || ""} onChange={(event) => updateActivity(day.day, activity.id, "location", event.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" /></label>
                    </div>
                    <label className="mt-3 flex flex-col gap-1 text-xs font-semibold text-slate-400">Notes / description<textarea rows="2" maxLength="700" value={activity.description || ""} onChange={(event) => updateActivity(day.day, activity.id, "description", event.target.value)} className="resize-y rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" /></label>
                  </div>
                ))}
                <button type="button" onClick={() => addActivity(day.day)} className="w-full rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-cyan-300/50 hover:text-cyan-200">+ Add your own activity</button>
              </div>
            </article>
          ))}

          {Array.isArray(tripPlan.budgetBreakdown) && tripPlan.budgetBreakdown.length > 0 && (
            <section className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
              <h4 className="text-lg font-bold">AI budget notes</h4>
              <div className="mt-3 divide-y divide-white/10">
                {tripPlan.budgetBreakdown.map((item, index) => <div key={item.category + "-" + index} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span className="text-slate-300">{item.category}{item.note ? " · " + item.note : ""}</span><span className="font-bold">{formatMoney(item.estimatedCost)}</span></div>)}
              </div>
            </section>
          )}

          {Array.isArray(tripPlan.tips) && tripPlan.tips.length > 0 && (
            <section className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
              <h4 className="text-lg font-bold">Useful travel tips</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{tripPlan.tips.map((tip, index) => <li key={index}>{tip}</li>)}</ul>
            </section>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={downloadPDF} className="rounded-xl bg-green-600 px-4 py-3 font-bold hover:bg-green-500">📄 Download PDF</button>
            <button type="button" onClick={speakItinerary} className="rounded-xl bg-blue-600 px-4 py-3 font-bold hover:bg-blue-500">🔊 Listen</button>
            <button type="button" onClick={stopSpeaking} className="rounded-xl bg-red-700 px-4 py-3 font-bold hover:bg-red-600">⏹ Stop</button>
            <button type="button" onClick={copyItinerary} className="rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 hover:bg-amber-400">{copied ? "✅ Copied" : "📋 Copy"}</button>
            <button type="button" onClick={shareItinerary} className="rounded-xl bg-violet-600 px-4 py-3 font-bold hover:bg-violet-500">📤 Share</button>
            <button type="button" onClick={() => { const ok = saveItinerary(from, to, tripPlan); setNotice(ok ? "Itinerary saved on this device." : "Could not save the itinerary on this device."); }} className="rounded-xl border border-white/15 px-4 py-3 font-bold hover:border-cyan-300/40 hover:text-cyan-200">💾 Save now</button>
            <button type="button" onClick={handleSaveOfflinePack} className="rounded-xl bg-cyan-300 px-4 py-3 font-extrabold text-slate-950 hover:bg-cyan-200">📦 Save offline pack</button>
          </div>
          <p className="text-xs leading-5 text-slate-500">All edits are stored locally in this browser or APK WebView. AI-generated places, costs and timings are suggestions; verify details before booking or travel.</p>
        </div>
      )}
    </section>
  );
}

export default AITripPlanner;
