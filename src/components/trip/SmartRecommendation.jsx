function SmartRecommendation({ travelModes }) {
  if (!Array.isArray(travelModes) || travelModes.length === 0) return null;

  const cheapest = [...travelModes].sort(
    (a, b) => Number(a.price) - Number(b.price)
  )[0];

  const fastest = [...travelModes].sort(
    (a, b) => Number(a.timeHours) - Number(b.timeHours)
  )[0];

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">💡 Smart Recommendation</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <article className="bg-slate-900 p-5 rounded-xl border border-white/5">
          <p className="text-sm text-slate-400">Best for saving money</p>
          <h3 className="mt-2 text-xl font-bold">{cheapest.mode}</h3>
          <p className="mt-2 text-cyan-300 font-semibold">
            ₹{Number(cheapest.price).toLocaleString("en-IN")}
          </p>
        </article>

        <article className="bg-slate-900 p-5 rounded-xl border border-white/5">
          <p className="text-sm text-slate-400">Best for saving time</p>
          <h3 className="mt-2 text-xl font-bold">{fastest.mode}</h3>
          <p className="mt-2 text-cyan-300 font-semibold">{fastest.time}</p>
        </article>
      </div>
    </section>
  );
}

export default SmartRecommendation;
