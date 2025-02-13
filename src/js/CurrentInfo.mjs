import { WeatherModal } from "./WeatherModal.mjs";

export default class CurrentWeather extends WeatherModal {
  constructor() {
    super("current-modal", "Current Weather");
  }

  async getWeatherData(lat, lon) {
    try {
      const response = await fetch(
        `${process.env.WEATHER_API}current?lat=${lat}&lon=${lon}&units=${this.selectedUnit}&key=${process.env.WEATHER_API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching current weather data:", error);
      return null;
    }
  }

  renderWeatherInfo(data) {
    if (!data || !data.data || data.data.length === 0) {
      return `<p style="color: red;">No weather data available. Please check your search.</p>`;
    }
    const unitSymbol = this.selectedUnit === "I" ? "°F" : this.selectedUnit === "S" ? "K" : "°C";
    const windSpeedUnit = this.selectedUnit === "I" ? "mph" : "m/s";
    const precipUnit = this.selectedUnit === "I" ? "in" : "mm";
    const weather = data.data[0];
    return `
      <div class="current-weather-info">
        <h3>Weather Information for: ${weather.city_name}, ${weather.country_code}</h3>
        <p><strong>Temperature:</strong> ${weather.temp}${unitSymbol}</p>
        <p><strong>Feels Like:</strong> ${weather.app_temp}${unitSymbol}</p>
        <p><strong>Weather:</strong> ${weather.weather.description}</p>
        <p><strong>Humidity:</strong> ${weather.rh}%</p>
        <p><strong>Wind Speed:</strong> ${weather.wind_spd} ${windSpeedUnit} (${weather.wind_cdir_full})</p>
        <p><strong>Cloud Coverage:</strong> ${weather.clouds}%</p>
        <p><strong>Precipitation:</strong> ${weather.precip} ${precipUnit}</p>
        <p><strong>UV Index:</strong> ${weather.uv}</p>
        <p><strong>AQI:</strong> ${weather.aqi}</p>
        <p><strong>Sunrise:</strong> ${weather.sunrise} AM</p>
        <p><strong>Sunset:</strong> ${weather.sunset} PM</p>
      </div>
    `;
  }
}