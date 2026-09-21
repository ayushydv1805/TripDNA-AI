function ForecastCard({ forecast }) {
  if (!Array.isArray(forecast) || forecast.length === 0) return null;

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">🌤 5-Day Weather Forecast</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {forecast.map((day, index) => (
          <article key={day.date || index} className="bg-slate-900 rounded-xl p-4 text-center">
            <p className="font-bold">
              {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
            </p>
            <img
              src={"https://openweathermap.org/img/wn/" + day.icon + "@2x.png"}
              alt={day.condition || "Weather"}
              loading="lazy"
              className="mx-auto"
            />
            <h3 className="text-xl font-bold">{Math.round(day.temperature)}°C</h3>
            <p>{day.condition}</p>
            <p className="text-gray-400 text-sm">{day.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ForecastCard;
