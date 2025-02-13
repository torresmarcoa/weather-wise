import { setupSearchBar } from "./utils.mjs";

export class WeatherModal {
  constructor(modalId, defaultTitle) {
    this.modalId = modalId; 
    this.selectedUnit = "M";
    this.defaultTitle = defaultTitle;
  }

  renderModal() {
    return `
      <div id="${this.modalId}" class="modal-weather">
        <div class="modal-content">
          <p class="closeModal">X</p>
          <h3>Select Units:</h3>
          <div id="unit-selection">
            <button class="unit-btn active" data-unit="M">°C</button>
            <button class="unit-btn" data-unit="S">K</button>
            <button class="unit-btn" data-unit="I">°F</button>
          </div>
          <h3>Search for a City:</h3>
          <div id="city-search-container"></div>
          <div id="weatherResult"></div>
        </div>
      </div>
    `;
  }

  displayModal(onCitySelectCallback) {
    document.body.insertAdjacentHTML("beforeend", this.renderModal());
    this.modalElement = document.getElementById(this.modalId);
    this.closeButton = this.modalElement.querySelector(".closeModal");
    this.unitButtons = this.modalElement.querySelectorAll(".unit-btn");
    this.searchContainer = this.modalElement.querySelector("#city-search-container");
    this.weatherResult = this.modalElement.querySelector("#weatherResult");

    this.closeButton.addEventListener("click", () => {
      this.modalElement.remove();
    });

    this.handleUnitSelection();

    setupSearchBar(async (city) => {
      if (!city || !city.lat || !city.lon) {
        console.error("Invalid city data:", city);
        return;
      }
      this.lastCity = city;
      const data = await this.getWeatherData(city.lat, city.lon);
      this.weatherResult.setAttribute("data-lat", city.lat);
      this.weatherResult.setAttribute("data-lon", city.lon);
      this.weatherResult.innerHTML = this.renderWeatherInfo(data);
    }, this.searchContainer);
  }

  handleUnitSelection() {
    this.unitButtons.forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        this.unitButtons.forEach((b) => b.classList.remove("active"));
        event.target.classList.add("active");
        this.selectedUnit = event.target.getAttribute("data-unit");

        if (this.weatherResult.getAttribute("data-lat") && this.weatherResult.getAttribute("data-lon")) {
          const lat = this.weatherResult.getAttribute("data-lat");
          const lon = this.weatherResult.getAttribute("data-lon");
          const data = await this.getWeatherData(lat, lon);
          this.weatherResult.innerHTML = this.renderWeatherInfo(data);
        }
      });
    });
  }

  async getWeatherData(lat, lon) {
    throw new Error("getWeatherData() must be implemented in subclass");
  }

  renderWeatherInfo(data) {
    throw new Error("renderWeatherInfo() must be implemented in subclass");
  }
}
