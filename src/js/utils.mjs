// utils.mjs
export async function searchCity(query) {
    const limit = 5;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${process.env.GEO_API_KEY}`;
    try {
      const response = await fetch(url);
        if (!response.ok) {
        const text = await response.text();
        console.error("API ERROR:", text);
        throw new Error("NOT OK");
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching city:", error);
      return [];
    }
  }
  

export function setupSearchBar(onCitySelect, container) {
  const searchContainer = document.createElement("div");
  searchContainer.id = "search-container";
  searchContainer.innerHTML = `
      <input type="text" id="citySearch" placeholder="Search for a city..." autocomplete="off"/>
      <ol id="suggestions"></ol>
    `;
  if (container) {
    container.appendChild(searchContainer);
  } else {
    document.body.insertAdjacentElement("afterbegin", searchContainer);
  }

  const searchInput = searchContainer.querySelector("#citySearch");
  const suggestionsList = searchContainer.querySelector("#suggestions");

  let timeoutId;
  searchInput.addEventListener("input", () => {
    clearTimeout(timeoutId);
    const query = searchInput.value;
    if (query.length < 3) {
      suggestionsList.innerHTML = "";
      return;
    }
    timeoutId = setTimeout(async () => {
      const results = await searchCity(query);
      suggestionsList.innerHTML = "";
      results.forEach((city) => {
        const li = document.createElement("li");
        li.textContent = `${city.name}${city.state ? ", " + city.state : ""}, ${
          city.country
        }`;
        li.style.cursor = "pointer";
        li.dataset.lat = city.lat;
        li.dataset.lon = city.lon;
        li.addEventListener("click", () => {
          onCitySelect({
            lat: city.lat,
            lon: city.lon,
            name: city.name,
            state: city.state,
            country: city.country,
          });
          suggestionsList.innerHTML = "";
          searchInput.value = `${city.name}${
            city.state ? ", " + city.state : ""
          }, ${city.country}`;
        });
        suggestionsList.appendChild(li);
      });
    }, 300);
  });
}
