export async function searchCity(query) {
  const API_URL = "https://api.openweathermap.org/geo/1.0/direct";
  const limit = 5;
  const url = `${API_URL}?q=${encodeURIComponent(query)}&limit=${limit}&appid=${process.env.GEO_API_KEY}`;

  try {
    const response = await fetch(url);
    return await validateResponse(response);
  } catch (error) {
    console.error("Error searching city:", error);
    return [];
  }
}

async function validateResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    console.error("API ERROR:", text);
    throw new Error("API response not OK");
  }
  return response.json();
}

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

    const { lat, lon, name, state, country } = li.dataset;
    onCitySelect({ lat, lon, name, state, country });

    searchInput.value = `${name}${state ? ", " + state : ""}, ${country}`;
    suggestionsList.innerHTML = "";
  });
}

function renderSuggestions(results, suggestionsList, searchInput, onCitySelect) {
  suggestionsList.innerHTML = results
    .map((city) => createSuggestionItem(city))
    .join("");
}

function createSuggestionItem(city) {
  return `
    <li data-lat="${city.lat}" data-lon="${city.lon}" 
        data-name="${city.name}" data-state="${city.state || ""}" 
        data-country="${city.country}" style="cursor: pointer;">
      ${city.name}${city.state ? ", " + city.state : ""}, ${city.country}
    </li>`;
}
