const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      wind: data.wind.speed,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getForecast(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    const dailyForecast = [];

    for (let i = 0; i < data.list.length; i += 8) {
      dailyForecast.push({
        date: data.list[i].dt_txt,
        temperature: data.list[i].main.temp,
        condition: data.list[i].weather[0].main,
        description: data.list[i].weather[0].description,
        icon: data.list[i].weather[0].icon,
      });
    }

    return dailyForecast;
  } catch (error) {
    console.error(error);
    return [];
  }
}