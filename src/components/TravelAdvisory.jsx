function TravelAdvisory({ weather, destination }) {
  if (!weather) return null;

  const tips = [];

  if (weather.temperature < 15)
    tips.push("🧥 Carry Warm Clothes");

  if (weather.temperature > 30)
    tips.push("🧢 Carry Cap & Sunscreen");

  if (
    weather.condition.toLowerCase().includes("rain")
  )
    tips.push("☔ Carry Umbrella");

  tips.push("💧 Stay Hydrated");
  tips.push("🪪 Carry ID Proof");
  tips.push("🔋 Carry Power Bank");

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">
        🛡 Travel Advisory
      </h2>

      <p className="mb-3">
        📍 Destination :
        <span className="font-bold"> {destination}</span>
      </p>

      <p className="mb-3">
        🌡 Temperature :
        <span className="font-bold">
          {" "}
          {weather.temperature}°C
        </span>
      </p>

      <p className="mb-5">
        🌤 Weather :
        <span className="font-bold">
          {" "}
          {weather.condition}
        </span>
      </p>

      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="bg-slate-900 p-3 rounded-lg"
          >
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TravelAdvisory;