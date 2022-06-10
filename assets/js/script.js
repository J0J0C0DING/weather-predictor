// Search History Container
const searchHistory = $(".history");
// Main Weather Section
const cityWeather = $("#day-0");
// City name span element
let cityNameSpan = $("#city-name");
// Search Input
const searchInput = document.querySelector("#search-input");
// Search Button
const searchBtn = $("#search-btn");
// City History
let savedCities = JSON.parse(localStorage.getItem("city")) || [];

$(searchBtn).on("click", function () {
  let searchInquery = $.trim($(searchInput).val());
  getLocationCoord(searchInquery);
  $("").replaceAll(".weather-item");

  // Add city to savedCities array
  let citySearch = { city: searchInquery };
  // Place new search at beginning of savedCities array
  savedCities.unshift(citySearch);
  // Save to local storage
  localStorage.setItem("city", JSON.stringify(savedCities));

  historyDisplay();

  searchInput.value = "";
});

// Search History
const historyDisplay = function () {
  // Limit to 5 search histories
  savedCities.splice(5);
  // Empty search history container
  $(searchHistory).empty();
  // Re-add / update search history container
  for (i = 0; i < savedCities.length; i++) {
    $(searchHistory).append(`<button class='historyItem' id='history-${i}'>${savedCities[i].city}</button>`);
  }
};
historyDisplay();

// Get location coordinates
const getLocationCoord = function (city) {
  // Get OpenWeather API url
  let apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=d1db20b74fefd2cbae86402d9eb44d4e`;
  // Make request to URL
  fetch(apiUrl)
    .then(function (response) {
      // Request was successful
      if (response.ok) {
        response.json().then(function (data) {
          if (data.length === 0) {
            alert(`Error: Please enter city name`);
          } else {
            getWeather(data[0].lat, data[0].lon, data[0].name);
          }
        });
      } else {
        alert(`Error: City not found in database`);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

const getWeather = function (lat, lon, name) {
  // Get next OpenWeather API
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude={part}&appid=d1db20b74fefd2cbae86402d9eb44d4e`;
  // Make request to the URL
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          // Get current weather data
          let currentWeather = data.current;
          // Get current weather icon code
          let icon = currentWeather.weather[0].icon;
          // Get city name from parent function
          let cityName = name;
          // Pass current weather items to display weather function for display
          displayWeather(cityName, 0, currentWeather.temp, currentWeather.wind_speed, currentWeather.humidity, currentWeather.uvi, icon);

          // Only grab the the next 5 days
          let forecastedWeather = data.daily.slice(0, 6);
          console.log(forecastedWeather);
          // Loop through current + 5 days
          for (i = 1; i < forecastedWeather.length; i++) {
            // Get day id (starting at index 1)
            let day = i;
            // Get temp
            let temp = forecastedWeather[i].temp.day;
            // Get wind speed
            let wind = forecastedWeather[i].wind_speed;
            // Get humidity
            let humidity = forecastedWeather[i].humidity;
            // Get forecasted weather icon
            let icon = forecastedWeather[i].weather[0].icon;
            // Pass empty uvi value
            let uvi = "";
            // Pass each value to display weather
            displayWeather(cityName, day, temp, wind, humidity, uvi, icon);
          }
        });
      } else {
        alert("Error: Could not get weather data");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

const displayWeather = function (city, day, temp, wind, humidity, uvi, icon) {
  // Update City Name
  $(cityNameSpan).text(city);

  // Choose corresponding day element
  let choosenBlock = $(`#day-${day}`);
  // Create div to hold weather list
  let mainWeatherEl = document.createElement("div");
  // Create list
  let weatherListEl = document.createElement("ul");

  // Create list item for temp
  let tempLi = document.createElement("li");
  tempLi.textContent = `Temp: ${Math.ceil(temp)} °F`;
  tempLi.classList.add("weather-item");

  // Create list item for wind speed
  let windLi = document.createElement("li");
  windLi.textContent = `Wind: ${Math.ceil(wind)} MPH`;
  windLi.classList.add("weather-item");

  // Create list item for humidity
  let humidityLi = document.createElement("li");
  humidityLi.textContent = `Humidity: ${Math.ceil(humidity)} %`;
  humidityLi.classList.add("weather-item");

  // Create list item for uv index
  let uviLi = document.createElement("li");
  uviLi.textContent = `UV Index:`;
  uviLi.classList.add("weather-item");

  // Create span element to show severity of UV index
  let uviSpan = document.createElement("div");
  uviSpan.classList.add("uvi-div");
  uviSpan.textContent = uvi;

  // Depending on uvi, change span background color
  if (uvi < 3) {
    uviSpan.classList.add("uv-low");
  } else if (3 < uvi && uvi < 6) {
    uviSpan.classList.add("uv-mod");
  } else if (6 < uvi && uvi < 8) {
    uviSpan.classList.add("uv-high");
  } else if (8 < uvi && uvi < 10) {
    uviSpan.classList.add("uv-very-high");
  } else {
    uviSpan.classList.add("uv-extreme");
  }
  uviLi.append(uviSpan);

  // Get icon for display
  let weatherIconUrl = `http://openweathermap.org/img/wn/${icon}.png`;
  let iconEl = document.createElement("img");
  iconEl.setAttribute("src", weatherIconUrl);
  iconEl.classList.add("weather-item");
  // For day 0 add everything
  if (day === 0) {
    $(weatherListEl).append(iconEl, tempLi, windLi, humidityLi, uviLi);
    $(mainWeatherEl).append(weatherListEl);
    $(choosenBlock).append(mainWeatherEl);
    // For every other day, do not add uv index
  } else {
    $(weatherListEl).append(iconEl, tempLi, windLi, humidityLi);
    $(mainWeatherEl).append(weatherListEl);
    $(choosenBlock).append(mainWeatherEl);
  }
};

// On load, display first city in local storage
$(document).ready(function () {
  if (savedCities[0]) {
    getLocationCoord(savedCities[0].city);
  }
});

$(".historyItem").click(function (event) {
  getLocationCoord(event.target.innerHTML);
  $("").replaceAll(".weather-item");
});
