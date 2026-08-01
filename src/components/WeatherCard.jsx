function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-5 my-5">
      <h2 className="text-2xl font-bold mb-3">
        🌤 Weather at Destination
      </h2>

      <p>🌡 Temperature: {weather.temperature} °C</p>
      <p>☁ Condition: {weather.condition}</p>
      <p>💧 Humidity: {weather.humidity}%</p>
      <p>💨 Wind: {weather.wind} m/s</p>

      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt="Weather"
      />
    </div>
  );
}

export default WeatherCard;