import { setupSearchBar } from "./utils.mjs";

function renderForecastWeather() {
  return `
      <div id="forecast-modal" class="modal-weather">
        <div class="modal-content">
          <p class="closeModal">X</p>
          <h3>Search for a City:</h3>
          <!-- Contenedor para la barra de búsqueda -->
          <div id="city-search-container"></div>
          <!-- Contenedor para mostrar la información del clima -->
          <div id="weatherResult"></div>
        </div>
      </div>
    `;
}

export default class ForecastWeather {
  constructor() {}

  async getWeatherData(lat, lon) {
    try {
      const response = await fetch(
        `${process.env.WEATHER_API}forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }

  renderWeatherInfo(data) {
    if (!data || !data.data || data.data.length === 0) {
      return `<p style="color: red;">No weather data available. Please check your search.</p>`;
    }

    const forecastHtml = data.data
      .slice(0, 5)
      .map(
        (day) => `
          <div class="weather-info">
            <h4>${day.valid_date}</h4>
            <p>${day.temp}°C</p>
            <p>${day.app_max_temp}°C</p>
            <p>${day.app_min_temp}°C</p>
            <p>${day.weather.description}</p>
            <p>${day.rh}%</p>
            <p>${day.wind_spd} m/s</p>
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

  displayForecastWeather() {
    document.body.insertAdjacentHTML("beforeend", renderForecastWeather());

    document.querySelector(".closeModal").addEventListener("click", () => {
      document.getElementById("forecast-modal").remove();
    });

    const searchContainer = document.getElementById("city-search-container");
    setupSearchBar(async (city) => {
      if (!city || !city.lat || !city.lon) {
        console.error("Invalid city data:", city);
        return;
      }

      const weatherData = await this.getWeatherData(city.lat, city.lon);
      document.getElementById("weatherResult").innerHTML =
        this.renderWeatherInfo(weatherData);
    }, searchContainer);
  }
}
    