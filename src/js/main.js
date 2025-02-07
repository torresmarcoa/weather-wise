import CurrentWeather from "./Weatherinfo.mjs";

const weather = new CurrentWeather();

document.getElementById("current").addEventListener("click", () => {
    weather.displayCurrentWeather();
});