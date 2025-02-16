import CurrentWeather from "./CurrentInfo.mjs";
import ForecastWeather from "./ForecastInfo.mjs";
import { darkmode, handleUnitSelection } from "./utils.mjs";

const weather = new CurrentWeather();
const forecast = new ForecastWeather();
darkmode()

document.getElementById("current").addEventListener("click", () => {
    weather.displayModal();
});

document.getElementById("forecast").addEventListener("click", () => {
    forecast.displayModal();
});

document.addEventListener("DOMContentLoaded", () => {
    const unitButtons = document.querySelectorAll(".unit-btn");
  
    handleUnitSelection(unitButtons, (selectedUnit) => {
      if (window.weatherModalInstance) {
        window.weatherModalInstance.selectedUnit = selectedUnit;
        window.weatherModalInstance.updateWeather();
      }
    });
  });