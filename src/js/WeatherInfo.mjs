import { setupSearchBar } from "./utils.mjs";

function renderCurrentWeather() {
    return `
      <div id="current-modal" class="modal-weather">
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
  
  export default class CurrentWeather {
    constructor() {}
  
    async getWeatherData(lat, lon) {
      try {
        const response = await fetch(`${process.env.WEATHER_API}current?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`);
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
      const weather = data.data[0];
      return `
        <div class="weather-info">
          <h3>Weather Information for: ${weather.city_name}, ${weather.country_code}</h3>
          <p><strong>Temperature:</strong> ${weather.temp}°C</p>
          <p><strong>Feels Like:</strong> ${weather.app_temp}°C</p>
          <p><strong>Weather:</strong> ${weather.weather.description}</p>
          <p><strong>Humidity:</strong> ${weather.rh}%</p>
          <p><strong>Wind Speed:</strong> ${weather.wind_spd} m/s (${weather.wind_cdir_full})</p>
          <p><strong>Cloud Coverage:</strong> ${weather.clouds}%</p>
          <p><strong>Precipitation:</strong> ${weather.precip} mm</p>
          <p><strong>UV Index:</strong> ${weather.uv}</p>
          <p><strong>Air Quality Index (AQI):</strong> ${weather.aqi}</p>
          <p><strong>Sunrise:</strong> ${weather.sunrise} AM</p>
          <p><strong>Sunset:</strong> ${weather.sunset} PM</p>
        </div>
      `;
    }
  
    displayCurrentWeather() {
      document.body.insertAdjacentHTML("beforeend", renderCurrentWeather());
  
      document.querySelector(".closeModal").addEventListener("click", () => {
        document.getElementById("current-modal").remove();
      });
  
      const searchContainer = document.getElementById("city-search-container");
      setupSearchBar(async (city) => {
        const weatherData = await this.getWeatherData(city.lat, city.lon);
        document.getElementById("weatherResult").innerHTML = this.renderWeatherInfo(weatherData);
      }, searchContainer);
    }
  }
  