import {
  setupSearchBar,
  displaySearchHistory,
  saveSearchHistory,
  handleUnitSelection,
} from "./utils.mjs";

//class definition for handling weather modal
export class WeatherModal {
  //defaults
  constructor(modalId, defaultTitle) {
    this.modalId = modalId;
    this.selectedUnit = "M";
    this.defaultTitle = defaultTitle;
  }

  //HTML structure
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
          <div id="search-history"></div>
          <h3>Search for a City:</h3>
          <div id="city-search-container"></div>
          <div id="weatherResult"></div>
        </div>
      </div>
    `;
  }

  //method to display the modal and initialize the event listeners
  displayModal() {
    document.body.insertAdjacentHTML("beforeend", this.renderModal());
    //modal elements
    this.modalElement = document.getElementById(this.modalId);
    this.closeButton = this.modalElement.querySelector(".closeModal");
    this.unitButtons = this.modalElement.querySelectorAll(".unit-btn");
    this.searchContainer = this.modalElement.querySelector(
      "#city-search-container"
    );
    this.weatherResult = this.modalElement.querySelector("#weatherResult");

    //closing button
    this.closeButton.addEventListener("click", () => {
      this.modalElement.classList.add("fade-out");
      setTimeout(() => {
        this.modalElement.remove();
      }, 500);
    });

    //load preferred unit from local storage and update the buttons
    const savedUnit = localStorage.getItem("preferredUnit");
    if (savedUnit) {
      this.selectedUnit = savedUnit;
      this.unitButtons.forEach((btn) => {
        btn.classList.toggle(
          "active",
          btn.getAttribute("data-unit") === savedUnit
        );
      });
    }

    //handles unit selection
    handleUnitSelection(this.unitButtons, (selectedUnit) => {
      this.selectedUnit = selectedUnit;

      //if weather data is already displayed, refresh it with new unit 
      if (
        this.weatherResult.getAttribute("data-lat") &&
        this.weatherResult.getAttribute("data-lon")
      ) {
        const lat = this.weatherResult.getAttribute("data-lat");
        const lon = this.weatherResult.getAttribute("data-lon");
        this.getWeatherData(lat, lon).then((data) => {
          this.weatherResult.innerHTML = this.renderWeatherInfo(data);
        });
      }
    });

    //search bar with callback funtions
    setupSearchBar(async (city) => {
      if (!city || !city.lat || !city.lon) {
        console.error("Invalid city data:", city);
        return;
      }
      this.lastCity = city;
      saveSearchHistory(city);

      const data = await this.getWeatherData(city.lat, city.lon);
      this.weatherResult.setAttribute("data-lat", city.lat);
      this.weatherResult.setAttribute("data-lon", city.lon);
      this.weatherResult.innerHTML = this.renderWeatherInfo(data);
    }, this.searchContainer);

    //display search history and allow selection of previous searches
    displaySearchHistory((city) => {
      this.lastCity = city;
      saveSearchHistory(city);
      this.getWeatherData(city.lat, city.lon).then((data) => {
        this.weatherResult.setAttribute("data-lat", city.lat);
        this.weatherResult.setAttribute("data-lon", city.lon);
        this.weatherResult.innerHTML = this.renderWeatherInfo(data);
      });
    });
  }

  //handles searching for a city and display weather data
  async performSearch(city) {
    if (!city || !city.lat || !city.lon) {
      console.error("Invalid city data:", city);
      return;
    }

    this.lastCity = city;
    saveSearchHistory(city);

    const data = await this.getWeatherData(city.lat, city.lon);
    this.weatherResult.setAttribute("data-lat", city.lat);
    this.weatherResult.setAttribute("data-lon", city.lon);
    this.weatherResult.innerHTML = this.renderWeatherInfo(data);
  }

  //Abstract methods to fetch data and render weather info (implemented in subclassses)
  async getWeatherData(lat, lon) {
    throw new Error("getWeatherData() must be implemented in subclass");
  }

  renderWeatherInfo(data) {
    throw new Error("renderWeatherInfo() must be implemented in subclass");
  }
}
