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
            const temperature = data.main.temp;
            const windSpeed = data.wind.speed;
            const humidity = data.main.humidity;

            const weatherInfo = `
                <div id="currentCity">
                    <h2>Weather in ${cityName}:</h2>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            `;

            document.getElementById('activeCity').innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            document.getElementById('activeCity').innerHTML = `<p>Error fetching current weather data: ${error.message}</p>`;
        });

    // Fetch 5-day forecast data
    fetch(forecastUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('There was a network response error');
        }
        return response.json();
    })
    .then(data => {
        
        const forecastData = data.list.slice(0, 5);
        let forecastHTML = '';

        forecastData.forEach(item => {
            const date = new Date(item.dt * 1000);
            const temperature = item.main.temp;
            const description = item.weather[0].description;

            forecastHTML += `
                <div class="fiveDay">
                    <p>Date: ${date.toDateString()}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Description: ${description}</p>
                </div>
            `;
        });

        // Add the h2 above the forecastHTML
        forecastHTML = '<h2>5-Day Forecast:</h2><br><div id="test">' + forecastHTML + '</div>';

        document.getElementById('active5Day').innerHTML = forecastHTML;
    })
    .catch(error => {
        console.error('Error fetching 5-day forecast data:', error);
        document.getElementById('active5Day').innerHTML = `<p>Error fetching 5-day forecast data: ${error.message}</p>`;
    });

}

document.getElementById('searchBtn').addEventListener('click', getWeather);

