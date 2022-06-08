const cityWeather = $("#day-0");

// Get location coordinates
const getLocationCoord = function (city) {
  // Get OpenWeather API url
  let apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=d1db20b74fefd2cbae86402d9eb44d4e`;
  // Make request to URL
  fetch(apiUrl)
    .then(function (response) {
      // Request was successful
      if (response.ok) {
        response.json().then(function (data) {
          if (data.length === 0) {
            alert(`Error: Please enter city name`);
          } else {
            getWeather(data[0].lat, data[0].lon);
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

const getWeather = function (lat, lon) {
  // Get next OpenWeather API
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude={part}&appid=d1db20b74fefd2cbae86402d9eb44d4e`;
  // Make request to the URL
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          let weatherData = data.daily.slice(0, 6);
          // Loop through current + 5 days
          for (i = 0; i < weatherData.length; i++) {
            let day = i;
            let temp = weatherData[i].temp.day;
            let wind = weatherData[i].wind_speed;
            let humidity = weatherData[i].humidity;
            let uvIndex = weatherData[i].uvi;
            displayWeather(day, temp, wind, humidity, uvIndex);
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

const displayWeather = function (day, temp, wind, humidity, uvi) {
  let choosenBlock = $(`#day-${day}`);
  let mainWeatherEl = document.createElement("div");
  let weatherListEl = document.createElement("ul");
  let weatherItem = document.createElement("li");

  weatherItem.textContent = `Temp: ${temp}`;
  weatherListEl.appendChild(weatherItem);
  mainWeatherEl.appendChild(weatherListEl);
  $(choosenBlock).append(mainWeatherEl);
  console.log(choosenBlock);
};

getLocationCoord("London");
