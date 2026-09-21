function TravelAdvisory({ weather, destination }) {
  if (!weather) return null;

  const condition = String(weather.condition || "").toLowerCase();
  const tips = [];

  if (weather.temperature < 15) tips.push("🧥 Carry warm clothes");
  if (weather.temperature > 30) tips.push("🧢 Carry a cap and sunscreen");
  if (condition.includes("rain")) tips.push("☔ Carry an umbrella");

  tips.push("💧 Stay hydrated");
  tips.push("🪪 Carry ID proof");
  tips.push("🔋 Carry a power bank");

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">🛡 Travel Advisory</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">Destination</p>
          <p className="mt-1 font-semibold break-words">{destination}</p>
        </div>
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">Temperature</p>
          <p className="mt-1 font-semibold">{weather.temperature}°C</p>
        </div>
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">Weather</p>
          <p className="mt-1 font-semibold">{weather.condition}</p>
        </div>
      </div>

      <div className="space-y-2">
        {tips.map((tip) => (
          <div key={tip} className="bg-slate-900 p-3 rounded-lg">{tip}</div>
        ))}
      </div>
    </section>
  );
}

export default TravelAdvisory;
