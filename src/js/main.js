import CurrentWeather from "./CurrentInfo.mjs";
import ForecastWeather from "./ForecastInfo.mjs";
import { darkmode, handleUnitSelection } from "./utils.mjs";

//instances of weather classes
const weather = new CurrentWeather();
const forecast = new ForecastWeather();

//enables dark mode functionality
darkmode()

//event listener to home buttons (open the modal)
document.getElementById("current").addEventListener("click", () => {
    weather.displayModal();
});

document.getElementById("forecast").addEventListener("click", () => {
    forecast.displayModal();
});

//wait for the DOM to fully load before executing the script
document.addEventListener("DOMContentLoaded", () => {
    const unitButtons = document.querySelectorAll(".unit-btn");

    //handles unit selection and update the weather modal with the selected unit
    handleUnitSelection(unitButtons, (selectedUnit) => {
      if (window.weatherModalInstance) {
        window.weatherModalInstance.selectedUnit = selectedUnit;
        window.weatherModalInstance.updateWeather();
      }
    });
  });