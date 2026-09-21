const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getWeather(lat, lon) {
  if (!API_KEY) {
    console.warn("OpenWeather API key is missing.");
    return null;
  }

  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        API_KEY +
        "&units=metric"
    );

    if (!response.ok) {
      throw new Error("Weather request failed (" + response.status + ").");
    }

    const data = await response.json();

    if (!data.main || !data.weather?.[0] || !data.wind) {
      throw new Error("Weather response was incomplete.");
    }

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      wind: data.wind.speed,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error("Weather error:", error);
    return null;
  }
}

export async function getForecast(lat, lon) {
  if (!API_KEY) return [];

  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        API_KEY +
        "&units=metric"
    );

    if (!response.ok) {
      throw new Error("Forecast request failed (" + response.status + ").");
    }

    const data = await response.json();
    if (!Array.isArray(data.list)) return [];

    const dailyForecast = [];

    for (let i = 0; i < data.list.length; i += 8) {
      const item = data.list[i];
      if (!item?.main || !item.weather?.[0]) continue;

      dailyForecast.push({
        date: item.dt_txt,
        temperature: item.main.temp,
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      });
    }

    return dailyForecast.slice(0, 5);
  } catch (error) {
    console.error("Forecast error:", error);
    return [];
  }
}
