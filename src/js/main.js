import CurrentWeather from "./WeatherInfo.mjs";

const weather = new CurrentWeather();

document.getElementById("current").addEventListener("click", () => {
    weather.displayCurrentWeather();
});