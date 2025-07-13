const API_KEY = '5aae7f40720449e16d6812513bbb9e48'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const locationButton = document.getElementById('location-button');
const mapContainer = document.getElementById('map');

const weatherResultDiv = document.getElementById('weather-result');

const cityNameElem = document.getElementById('city-name');
const dateTimeElem = document.getElementById('date-time');
const weatherIconElem = document.getElementById('weather-icon');
const temperatureElem = document.getElementById('temperature');
const descriptionElem = document.getElementById('description');
const humidityElem = document.getElementById('humidity');
const windSpeedElem = document.getElementById('wind-speed');

const errorMessageElem = document.getElementById('error-message');

searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city === '') {
    showError('Please enter a city name.');
    return;
  }
  fetchWeatherByCity(city);
});

cityInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchButton.click();
  }
});

locationButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    showElement(mapContainer); // Show the map when using location
  } else {
    showError('Geolocation is not supported by this browser.');
  }
});

function successCallback(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeatherByCoordinates(lat, lon);
}

function errorCallback() {
  showError('Unable to retrieve your location.');
}

async function fetchWeatherByCity(city) {
  hideElement(weatherResultDiv);
  hideElement(errorMessageElem);

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        showError('City not found. Please try again.');
      } else {
        showError('An error occurred. Please try later.');
      }
      return;
    }

    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.error('Fetch error:', error);
    showError('Network error. Please check your connection.');
  }
}

async function fetchWeatherByCoordinates(lat, lon) {
  hideElement(weatherResultDiv);
  hideElement(errorMessageElem);

  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      showError('An error occurred. Please try later.');
      return;
    }

    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.error('Fetch error:', error);
    showError('Network error. Please check your connection.');
  }
}

async function updateWeatherUI(data) {
  let displayName;

  if (data.name) {
    displayName = `${data.name}, ${data.sys.country}`;
  } else {
    const placeName = await reverseGeocode(data.coord.lat, data.coord.lon);
    displayName = placeName || `Lat: ${data.coord.lat.toFixed(2)}, Lon: ${data.coord.lon.toFixed(2)}`;
  }

  cityNameElem.textContent = displayName;

  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  dateTimeElem.textContent = formattedDate;

  const iconCode = data.weather[0].icon;
  weatherIconElem.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconElem.alt = data.weather[0].description;

  temperatureElem.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionElem.textContent = data.weather[0].description;
  humidityElem.textContent = data.main.humidity;
  windSpeedElem.textContent = data.wind.speed;

  showElement(weatherResultDiv);
}

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Weather-App-Example' } });
    if (!response.ok) return null;

    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
}

function showElement(elem) {
  elem.classList.remove('hidden');
}

function hideElement(elem) {
  if (!elem.classList.contains('hidden')) {
    elem.classList.add('hidden');
  }
}

function showError(message) {
  errorMessageElem.textContent = message;
  showElement(errorMessageElem);
}

// Map
showElement(mapContainer); // Optional: show the map by default, or comment this out if you want it hidden at first

const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.on('click', function (e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;
  showElement(mapContainer); // Show if hidden
  fetchWeatherByCoordinates(lat, lon);
});
