import { useEffect, useMemo, useState } from "react";
import {
  calculateDetailedBudget,
  DETAILED_BUDGET_DEFAULTS,
} from "../../services/travel/budget";

const CURRENCY = (value) => "₹" + Math.round(Number(value) || 0).toLocaleString("en-IN");

function budgetStorageKey(from, to) {
  return "tripDnaBudget:" + [String(from || "").trim().toLowerCase(), String(to || "").trim().toLowerCase()].join("|");
}

function readSavedState(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return {
      settings: { ...DETAILED_BUDGET_DEFAULTS, ...(parsed?.settings || {}) },
      expenses: Array.isArray(parsed?.expenses) ? parsed.expenses.filter((item) => item && typeof item === "object") : [],
    };
  } catch {
    return { settings: { ...DETAILED_BUDGET_DEFAULTS }, expenses: [] };
  }
}

function BudgetCard({ distance, from = "", to = "" }) {
  const storageKey = budgetStorageKey(from, to);
  const [initial] = useState(() => readSavedState(storageKey));
  const [settings, setSettings] = useState(initial.settings);
  const [expenses, setExpenses] = useState(initial.expenses);
  const [expenseName, setExpenseName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseError, setExpenseError] = useState("");
  const routeDistance = Number.isFinite(Number(distance)) ? Math.max(0, Number(distance)) : 0;

  const estimate = useMemo(
    () => calculateDetailedBudget(routeDistance, settings),
    [routeDistance, settings]
  );
  const actualSpend = useMemo(
    () => expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [expenses]
  );
  const variance = actualSpend - estimate.total;

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ settings, expenses }));
    } catch (error) {
      console.warn("Could not persist this budget on the device:", error);
    }
  }, [storageKey, settings, expenses]);

  function updateSetting(name, value) {
    setSettings((current) => ({ ...current, [name]: value }));
  }

  function addExpense(event) {
    event.preventDefault();
    setExpenseError("");
    const amount = Number(expenseAmount);
    if (!expenseName.trim()) {
      setExpenseError("Enter a description for this expense.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setExpenseError("Enter an expense amount greater than zero.");
      return;
    }

    setExpenses((current) => [{
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2),
      name: expenseName.trim().slice(0, 100),
      category: expenseCategory,
      amount: Math.round(amount),
      date: new Date().toISOString(),
    }, ...current].slice(0, 100));
    setExpenseName("");
    setExpenseAmount("");
  }

  function resetBudget() {
    setSettings({ ...DETAILED_BUDGET_DEFAULTS });
  }

  const numberFields = [
    ["travelers", "Travelers", 1, 30, 1],
    ["nights", "Hotel nights", 0, 60, 1],
    ["foodDays", "Days requiring meals", 1, 60, 1],
    ["mileageKmPerLitre", "Vehicle mileage (km/L)", 1, 100, 1],
    ["petrolPricePerLitre", "Fuel price (₹/L)", 1, 500, 1],
    ["hotelPerRoomPerNight", "Hotel per room/night (₹)", 0, 1000000, 100],
    ["guestsPerRoom", "Guests per room", 1, 10, 1],
    ["foodPerPersonPerDay", "Food per person/day (₹)", 0, 100000, 50],
    ["activitiesPerPerson", "Activities per person (₹)", 0, 1000000, 100],
    ["otherCosts", "Other planned costs (₹)", 0, 10000000, 100],
    ["contingencyPercent", "Contingency (%)", 0, 30, 1],
  ];

  const lineItems = [
    ["🚗", "Fuel / transport estimate", estimate.fuelCost],
    ["🏨", "Accommodation (" + estimate.rooms + " room" + (estimate.rooms === 1 ? "" : "s") + ")", estimate.hotelCost],
    ["🍲", "Food", estimate.foodCost],
    ["🎟️", "Activities / sightseeing", estimate.activitiesCost],
    ["🧾", "Other planned costs", estimate.otherCosts],
    ["🛟", "Contingency (" + estimate.contingencyPercent + "%)", estimate.contingency],
  ];

  return (
    <section className="my-6 rounded-2xl border border-white/10 bg-slate-800 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Phase 2 · Cost control</p>
          <h2 className="mt-1 text-2xl font-black">💰 Trip Budget & Expense Tracker</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Adjust the assumptions for your group. These are planning estimates, not live fuel, hotel, or booking quotes.
          </p>
        </div>
        <button type="button" onClick={resetBudget} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold hover:border-emerald-300/40 hover:text-emerald-200">
          Reset assumptions
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Estimated group total</p>
          <p className="mt-1 text-2xl font-black text-emerald-300">{CURRENCY(estimate.total)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Estimated per person</p>
          <p className="mt-1 text-2xl font-black">{CURRENCY(estimate.perPerson)}</p>
          <p className="mt-1 text-xs text-slate-500">Split across {estimate.travelers} traveler(s)</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Actual expenses logged</p>
          <p className="mt-1 text-2xl font-black">{CURRENCY(actualSpend)}</p>
          <p className={"mt-1 text-xs " + (variance > 0 ? "text-red-300" : "text-emerald-300")}>
            {variance > 0 ? CURRENCY(variance) + " over estimate" : CURRENCY(Math.abs(variance)) + " under estimate so far"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
          <h3 className="text-lg font-bold">Customize your estimate</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {numberFields.map(([name, label, min, max, step]) => (
              <label key={name} className="flex min-w-0 flex-col gap-1.5 text-sm">
                <span className="text-slate-300">{label}</span>
                <input
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={settings[name]}
                  onChange={(event) => updateSetting(name, event.target.value === "" ? 0 : Number(event.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-300"
                />
              </label>
            ))}
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-slate-950/70 p-3 text-sm">
            <input type="checkbox" checked={Boolean(settings.roundTrip)} onChange={(event) => updateSetting("roundTrip", event.target.checked)} className="h-4 w-4 accent-emerald-400" />
            <span>
              <span className="block font-semibold">Include return fuel journey</span>
              <span className="mt-0.5 block text-xs text-slate-400">Doubles the route distance for fuel only.</span>
            </span>
          </label>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Fuel assumes the chosen mileage and price. Hotel cost uses rooms = travelers divided by guests per room, rounded up. Edit these values to match your trip.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
          <h3 className="text-lg font-bold">Budget breakdown</h3>
          <p className="mt-1 text-sm text-slate-400">Route distance used: {routeDistance.toFixed(1)} km {settings.roundTrip ? "(return fuel included)" : "(one-way fuel)"}</p>
          <div className="mt-4 space-y-3">
            {lineItems.map(([icon, label, amount]) => (
              <div key={label} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                <span className="text-sm text-slate-300">{icon} {label}</span>
                <span className="shrink-0 font-bold">{CURRENCY(amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <span className="font-bold">Total planned budget</span>
            <span className="text-2xl font-black text-emerald-300">{CURRENCY(estimate.total)}</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">For {estimate.travelers} traveler(s): {CURRENCY(estimate.perPerson)} per person.</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
        <h3 className="text-lg font-bold">🧾 Track actual expenses</h3>
        <p className="mt-1 text-sm text-slate-400">Add costs as you spend. This log is saved locally for this route and remains on this device.</p>
        <form onSubmit={addExpense} className="mt-4 grid gap-3 sm:grid-cols-[1fr_150px_150px_auto]">
          <input value={expenseName} onChange={(event) => setExpenseName(event.target.value)} maxLength={100} placeholder="Expense (e.g. lunch)" className="min-w-0 rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-300" />
          <select value={expenseCategory} onChange={(event) => setExpenseCategory(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-300">
            <option>Transport</option><option>Hotel</option><option>Food</option><option>Activities</option><option>Shopping</option><option>Other</option>
          </select>
          <input type="number" min="1" max="10000000" step="1" value={expenseAmount} onChange={(event) => setExpenseAmount(event.target.value)} placeholder="Amount (₹)" className="min-w-0 rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-300" />
          <button type="submit" className="rounded-lg bg-emerald-400 px-4 py-2.5 font-extrabold text-slate-950 hover:bg-emerald-300">Add expense</button>
        </form>
        {expenseError && <p role="alert" className="mt-3 text-sm text-red-300">{expenseError}</p>}
        {expenses.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-white/10 p-4 text-sm text-slate-500">No actual expenses recorded yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-white/10">
            {expenses.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.category} · {new Date(item.date).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{CURRENCY(item.amount)}</span>
                  <button type="button" onClick={() => setExpenses((current) => current.filter((expense) => expense.id !== item.id))} aria-label={"Delete expense " + item.name} className="rounded-md px-2 py-1 text-sm text-red-300 hover:bg-red-500/10">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default BudgetCard;
