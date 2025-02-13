import CurrentWeather from "./CurrentInfo.mjs";
import ForecastWeather from "./ForecastInfo.mjs";

const weather = new CurrentWeather();
const forecast = new ForecastWeather();

document.getElementById("current").addEventListener("click", () => {
    weather.displayModal();
});

document.getElementById("forecast").addEventListener("click", () => {
    forecast.displayModal();
});