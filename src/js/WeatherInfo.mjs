function renderCurrentWeather() {
    return `
        <div id="current-modal" class="modal-weather">
            <div class="modal-content">
                <p class="closeModal">X</p>
                <h3>Enter coordinates:</h3>
                <label>Latitude:</label>
                <input type="text" id="latitude" placeholder="e.g., 35.7796">
                <label>Longitude:</label>
                <input type="text" id="longitude" placeholder="e.g., -78.6382">
                <button id="getWeather">Get Weather</button>
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
            console.log("Weather Data:", data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    displayCurrentWeather() {
        document.body.insertAdjacentHTML("beforeend", renderCurrentWeather());

        document.querySelector(".closeModal").addEventListener("click", () => {
            document.getElementById("current-modal").remove();
        });

        document.getElementById("getWeather").addEventListener("click", () => {
            const lat = document.getElementById("latitude").value;
            const lon = document.getElementById("longitude").value;

            if (lat && lon) {
                this.getWeatherData(lat, lon);
                document.getElementById("current-modal").remove();
            } else {
                alert("Please enter valid latitude and longitude!");
            }
        });
    }
}
