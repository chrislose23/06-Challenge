// My API Key
const apiKey = '5842a6da3b2ee4a199a3f215f476fb35';

function getWeather(event) {
    // This prevents default form submission
    event.preventDefault();

    const cityName = document.getElementById('searchBar').value;
    const currentWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('There was a network response error');
            }
            return response.json();
        })
        .then(data => {
            // Display current weather
            displayCurrentWeather(cityName, data);

            // Save search to local storage
            saveToLocalStorage(cityName);
            
            // Display recent searches
            displayRecentSearches();
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            document.getElementById('activeCity').innerHTML = `<p>Error fetching current weather data: ${error.message}</p>`;
        });

    // Fetch the 5-day forecast data
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('There was a network response error');
            }
            return response.json();
        })
        .then(data => {
            displayFiveDayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching 5-day forecast data:', error);
            document.getElementById('active5Day').innerHTML = `<p>Error fetching 5-day forecast data: ${error.message}</p>`;
        });
}

function displayCurrentWeather(cityName, data) {
    const temperatureC = data.main.temp;
    const temperatureF = (temperatureC * 9/5) + 32;
    const windSpeedMPS = data.wind.speed;
    const windSpeedMPH = windSpeedMPS * 2.237;
    const humidity = data.main.humidity;

    const weatherInfo = `
        <div id="currentCity">
            <h2>Weather in ${cityName}:</h2>
            <p>Temperature: ${temperatureF}°F</p>
            <p>Wind Speed: ${windSpeedMPH} m/h</p>
            <p>Humidity: ${humidity}%</p>
        </div>
    `;

    document.getElementById('activeCity').innerHTML = weatherInfo;
}

function saveToLocalStorage(cityName) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    // Check if the city is already in recent searches
    if (!recentSearches.includes(cityName)) {
        // Add the city to recent searches
        recentSearches.push(cityName);
        // Max recent searches at 5
        if (recentSearches.length > 5) {
            recentSearches = recentSearches.slice(-5);
        }
        // Update local storage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
}

// Retrieve recent searches from local storage
function getRecentSearchesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('recentSearches')) || [];
}

// Display recent searches
function displayRecentSearches() {
    const recentSearches = getRecentSearchesFromLocalStorage();

    const recentSearchesHTML = recentSearches.map(cityName => `
        <button class="btn btn-secondary recentSearch" data-city="${cityName}">${cityName}</button>
    `).join('');

    document.getElementById('recent').innerHTML = recentSearchesHTML;

    // Event listeners
    document.querySelectorAll('.recentSearch').forEach(button => {
        button.addEventListener('click', () => {
            const cityName = button.dataset.city;
            document.getElementById('searchBar').value = cityName;
            getWeather(new Event('submit'));
        });
    });
}

// Show Recent Searches when the page loads
window.addEventListener('load', displayRecentSearches);

function displayFiveDayForecast(data) {
    const forecastData = data.list.filter(item => {
        const localHour = new Date(item.dt_txt + ' UTC').getUTCHours();
        const localMinute = new Date(item.dt_txt + ' UTC').getUTCMinutes();
        return localHour === 15 && localMinute === 0;
    }).slice(0, 5);

    let forecastHTML = '';

        forecastData.forEach(item => {
            const date = new Date(item.dt_txt);
            const newDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            const description = item.weather[0].description;
            const temperatureC = item.main.temp;
            const temperatureF = (temperatureC * 9/5) + 32;
            const windSpeedMPS = item.wind.speed;
            const windSpeedMPH = windSpeedMPS * 2.237;
            const humidity = item.main.humidity;

            forecastHTML += `
                <div class="fiveDay">
                    <p>${newDate}</p>
                    <p>${description}</p>
                    <p>Temp: ${temperatureF}°F</p>
                    <p>Wind: ${windSpeedMPH} m/h</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            `;
        });

        // Added the h2 above the forecastHTML
        forecastHTML = '<h2>5-Day Forecast:</h2><br><div id="test">' + forecastHTML + '</div>';

    document.getElementById('active5Day').innerHTML = forecastHTML;
}

document.getElementById('searchBtn').addEventListener('click', getWeather);
