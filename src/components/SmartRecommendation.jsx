function SmartRecommendation({ travelModes }) {
  if (!travelModes) return null;

  const cheapest = [...travelModes].sort(
    (a, b) => a.price - b.price
  )[0];

  const fastest = [...travelModes].sort(
    (a, b) => a.time - b.time
  )[0];

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-6">

      <h2 className="text-3xl font-bold mb-5">
        🤖 AI Recommendation
      </h2>

      <div className="space-y-4">

        <div className="bg-slate-900 p-4 rounded-lg">
          💰 Cheapest Option :
          <br />
          <b>{cheapest.mode}</b>
          <br />
          ₹{cheapest.price}
        </div>

        <div className="bg-slate-900 p-4 rounded-lg">
          ⚡ Fastest Option :
          <br />
          <b>{fastest.mode}</b>
          <br />
          {fastest.time} hrs
        </div>

      </div>

    </div>
  );
}

export default SmartRecommendation;