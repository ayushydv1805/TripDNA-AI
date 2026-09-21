function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <section className="bg-slate-800 rounded-xl p-5 my-5">
      <h2 className="text-2xl font-bold mb-3">🌤 Weather at Destination</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <p>🌡 Temperature: {weather.temperature} °C</p>
        <p>☁ Condition: {weather.condition}</p>
        <p>💧 Humidity: {weather.humidity}%</p>
        <p>💨 Wind: {weather.wind} m/s</p>
      </div>

      {weather.icon && (
        <img
          src={"https://openweathermap.org/img/wn/" + weather.icon + "@2x.png"}
          alt={weather.condition || "Weather"}
          loading="lazy"
        />
      )}
    </section>
  );
}

export default WeatherCard;
