// weather-app.js

// --- API Key and Base URL ---
// IMPORTANT: Replace 'YOUR_OPENWEATHER_API_KEY' with your actual OpenWeatherMap API key.
// You can get one for free at: https://openweathermap.org/api
const API_KEY = '3906f0690741b9dad7dbb6c2925627f4';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// --- Get DOM Elements ---
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const weatherDisplay = document.getElementById('weather-display');

const cityNameElem = document.getElementById('city-name');
const weatherIconElem = document.getElementById('weather-icon');
const temperatureElem = document.getElementById('temperature');
const descriptionElem = document.getElementById('description');
const humidityElem = document.getElementById('humidity');
const windSpeedElem = document.getElementById('wind-speed');

// --- Helper Functions for UI State ---
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showError(message) {
    errorMessage.classList.remove('hidden');
    errorMessage.querySelector('p').textContent = message;
    weatherDisplay.classList.add('hidden'); // Hide weather display on error
    hideLoading();
}

function hideError() {
    errorMessage.classList.add('hidden');
    errorMessage.querySelector('p').textContent = '';
}

function showWeatherDisplay() {
    weatherDisplay.classList.remove('hidden');
    hideError();
    hideLoading();
}

// --- Fetch Weather Data ---
async function getWeatherData(city) {
    if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
        showError('Please replace "YOUR_OPENWEATHER_API_KEY" in weather-app.js with your actual OpenWeatherMap API key.');
        return;
    }

    showLoading(); // Show loading indicator

    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`); // units=metric for Celsius

        if (!response.ok) {
            // Handle HTTP errors
            if (response.status === 404) {
                showError(`City not found: "${city}". Please check the spelling.`);
            } else if (response.status === 401) {
                showError('Invalid API Key. Please check your OpenWeatherMap API key.');
            } else {
                showError(`Error: ${response.status} ${response.statusText}`);
            }
            return; // Exit function on error
        }

        const data = await response.json();
        updateWeatherUI(data); // Update UI with fetched data
        showWeatherDisplay(); // Show weather display
    } catch (error) {
        console.error('Fetch error:', error);
        showError('Could not fetch weather data. Please check your internet connection.');
    } finally {
        hideLoading(); // Always hide loading indicator when done (success or error)
    }
}

// --- Update UI with Weather Data ---
function updateWeatherUI(data) {
    cityNameElem.textContent = data.name;
    temperatureElem.textContent = Math.round(data.main.temp); // Round temperature
    descriptionElem.textContent = data.weather[0].description;
    humidityElem.textContent = data.main.humidity;
    windSpeedElem.textContent = data.wind.speed;

    // Get weather icon code and construct icon URL
    const iconCode = data.weather[0].icon;
    weatherIconElem.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElem.alt = data.weather[0].description;
}

// --- Event Listeners ---
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim(); // Trim whitespace
    if (city) {
        getWeatherData(city);
    } else {
        showError('Please enter a city name.');
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click(); // Simulate a click on the search button
    }
});

// --- Initial Load (Optional: fetch weather for a default city) ---
// getWeatherData('London'); // Uncomment to load weather for a default city on page load
