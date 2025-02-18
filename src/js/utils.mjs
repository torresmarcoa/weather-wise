import darkModeDark from "../public/images/dark-mode-dark.webp";
import darkModeLight from "../public/images/dark-mode.webp";

//Fetches city data based in the search query using the OpenWeather API
export async function searchCity(query) {
  const API_URL = "https://api.openweathermap.org/geo/1.0/direct";
  const limit = 5;
  const url = `${API_URL}?q=${encodeURIComponent(query)}&limit=${limit}&appid=${
    process.env.GEO_API_KEY
  }`;

  try {
    const response = await fetch(url);
    return await validateResponse(response);
  } catch (error) {
    console.error("Error searching city:", error);
    return [];
  }
}

//Validates the api response and handles errors
async function validateResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    console.error("API ERROR:", text);
    throw new Error("API response not OK");
  }
  return response.json();
}

//Creates the search bar component, handles user input to fetch and display city suggestions
export function setupSearchBar(onCitySelect, container) {
  const searchContainer = document.createElement("div");
  searchContainer.id = "search-container";
  searchContainer.innerHTML = `
    <input type="text" id="citySearch" placeholder="Search for a city..." autocomplete="off"/>
    <ul id="suggestions"></ul>
  `;

  (container || document.body).appendChild(searchContainer);

  const searchInput = searchContainer.querySelector("#citySearch");
  const suggestionsList = searchContainer.querySelector("#suggestions");

  let timeoutId;

  searchInput.addEventListener("input", () => {
    clearTimeout(timeoutId);
    const query = searchInput.value.trim();

    if (query.length < 3) {
      suggestionsList.innerHTML = "";
      return;
    }

    timeoutId = setTimeout(async () => {
      const results = await searchCity(query);
      renderSuggestions(results, suggestionsList, searchInput, onCitySelect);
    }, 300);
  });

  suggestionsList.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;

    const city = {
      lat: li.dataset.lat,
      lon: li.dataset.lon,
      name: li.dataset.name,
      state: li.dataset.state || "",
      country: li.dataset.country,
    };

    onCitySelect(city);
    saveSearchHistory(city);

    searchInput.value = `${city.name}${city.state ? ", " + city.state : ""}, ${
      city.country
    }`;
    suggestionsList.innerHTML = "";
  });
}

//Function to render the city suggestions based on search results
function renderSuggestions(results, suggestionsList) {
  suggestionsList.innerHTML = results
    .map((city) => createSuggestionItem(city))
    .join("");
}

//Creates and HTML list item for a city suggestion
function createSuggestionItem(city) {
  return `
    <li data-lat="${city.lat}" data-lon="${city.lon}" 
        data-name="${city.name}" data-state="${city.state || ""}" 
        data-country="${city.country}" style="cursor: pointer;">
      ${city.name}${city.state ? ", " + city.state : ""}, ${city.country}
    </li>`;
}

//Function to handle unit selection for temperature conversion and stores the preference
export function handleUnitSelection(buttons, onUnitChange) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const selectedUnit = event.target.getAttribute("data-unit");

      localStorage.setItem("preferredUnit", selectedUnit);

      document.querySelectorAll(".unit-btn").forEach((b) => {
        b.classList.toggle(
          "active",
          b.getAttribute("data-unit") === selectedUnit
        );
      });

      if (onUnitChange) onUnitChange(selectedUnit);
    });
  });

  const savedUnit = localStorage.getItem("preferredUnit");
  if (savedUnit) {
    document.querySelectorAll(".unit-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-unit") === savedUnit);
    });
  }
}

//Toggles dark mode and light mode, saving the preference in local storage
export function darkmode() {
  const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
  const darkModeLarge = document.getElementById("dark-modeLarge");

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.body.classList.toggle("dark-mode", savedTheme === "dark");

    if (savedTheme === "dark") {
      darkModeLarge.src = darkModeDark;
    } else {
      darkModeLarge.src = darkModeLight;
    }
  }

  toggleDarkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      darkModeLarge.src = darkModeDark;
      localStorage.setItem("theme", "dark");
    } else {
      darkModeLarge.src = darkModeLight;
      localStorage.setItem("theme", "light");
    }
  });
}

//function to save the last three seached cities in local storage
//updates the search history display
export function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  history = history.filter(
    (item) => item.lat !== city.lat || item.lon !== city.lon
  );

  history.unshift(city);
  history = history.slice(0, 3);

  localStorage.setItem("searchHistory", JSON.stringify(history));

  displaySearchHistory();
}

//function to display the search history and click on the past search
export function displaySearchHistory(onCityClick) {
  const historyContainer = document.getElementById("search-history");
  const historyPElement = document.createElement("div");
  if (!historyContainer) return;

  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  historyContainer.innerHTML = "<h3>Recent Searches:</h3>";

  history.forEach((city) => {
    const cityElement = document.createElement("p");
    cityElement.textContent = `${city.name}${
      city.state ? ", " + city.state : ""
    }, ${city.country}`;
    cityElement.dataset.lat = city.lat;
    cityElement.dataset.lon = city.lon;
    cityElement.dataset.name = city.name;
    cityElement.dataset.state = city.state || "";
    cityElement.dataset.country = city.country;
    cityElement.style.cursor = "pointer";

    historyPElement.appendChild(cityElement);
  });

  historyContainer.appendChild(historyPElement);
  historyPElement.classList = "search-history-p";

  historyPElement.removeEventListener("click", handleHistoryClick);
  historyPElement.addEventListener("click", handleHistoryClick);

  function handleHistoryClick(event) {
    const cityElement = event.target.closest("p");
    if (!cityElement) return;

    const city = {
      lat: cityElement.dataset.lat,
      lon: cityElement.dataset.lon,
      name: cityElement.dataset.name,
      state: cityElement.dataset.state,
      country: cityElement.dataset.country,
    };

    if (onCityClick) {
      onCityClick(city);
    }
  }
}
