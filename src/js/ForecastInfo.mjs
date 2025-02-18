import { WeatherModal } from "./WeatherModal.mjs";

//extend weathermodal class and handling weather info
export default class ForecastWeather extends WeatherModal {
  constructor() {
    //calls the base class
    super("forecast-modal", "Forecast Weather");
  }

  //fetch weather forecast data using forecast endpoint
  async getWeatherData(lat, lon) {
    try {
      const response = await fetch(
        `${process.env.WEATHER_API}forecast/daily?lat=${lat}&lon=${lon}&units=${this.selectedUnit}&key=${process.env.WEATHER_API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching forecast weather data:", error);
      return null;
    }
  }

  //generates the HTML to display weather forecast information (showing up to 5 days).
  renderWeatherInfo(data) {
    if (!data || !data.data || data.data.length === 0) {
      return `<p style="color: red;">No weather data available. Please check your search.</p>`;
    }

    const unitSymbol =
      this.selectedUnit === "I" ? "°F" : this.selectedUnit === "S" ? "K" : "°C";
    const windSpeedUnit = this.selectedUnit === "I" ? "mph" : "m/s";

    const forecastHtml = data.data
      .slice(0, 5)
      .map(
        (day) => `
      <div class="weather-info">
        <h4 class="sm-screen">Date:</h4>
        <h4>${day.valid_date}</h4>
        <p class="sm-screen"><strong>Temperature:</strong></p>
        <p>${day.temp} ${unitSymbol}</p>
        <p class="sm-screen"><strong>Max Feels Like:</strong></p>
        <p>${day.app_max_temp} ${unitSymbol}</p>
        <p class="sm-screen"><strong>Min Feels Like:</strong></p>
        <p>${day.app_min_temp} ${unitSymbol}</p>
        <p class="sm-screen"><strong>Weather:</strong></p>
        <p>${day.weather.description}</p>
        <p class="sm-screen"><strong>Humidity:</strong></p>
        <p>${day.rh}%</p>
        <p class="sm-screen"><strong>Wind Speed:</strong></p>
        <p>${day.wind_spd} ${windSpeedUnit}</p>
      </div>
    `
      )
      .join("");

    return `
      <h3>Weather Forecast for: ${data.city_name}, ${data.country_code}</h3>
      <div class="weather-info-modal">
        <div class="weather-info-header">
          <h4>Date:</h4>
          <p><strong>Temperature:</strong></p>
          <p><strong>Max Feels Like:</strong></p>
          <p><strong>Min Feels Like:</strong></p>
          <p><strong>Weather:</strong></p>
          <p><strong>Humidity:</strong></p>
          <p><strong>Wind Speed:</strong></p>
        </div>
        ${forecastHtml}
      </div>
    `;
  }
}
