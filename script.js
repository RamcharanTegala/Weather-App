const API_KEY = '5aae7f40720449e16d6812513bbb9e48';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');

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
    fetchWeather(city);
});

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

async function fetchWeather(city) {
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

function updateWeatherUI(data) {
    cityNameElem.textContent = `${data.name}, ${data.sys.country}`;

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

    // Show the result section
    showElement(weatherResultDiv);
}

// Utility to show an element
function showElement(elem) {
    elem.classList.remove('hidden');
}

// Utility to hide an element
function hideElement(elem) {
    if (!elem.classList.contains('hidden')) {
        elem.classList.add('hidden');
    }
}

// Display error messages
function showError(message) {
    errorMessageElem.textContent = message;
    showElement(errorMessageElem);
}
