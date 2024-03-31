const apiKey = '5842a6da3b2ee4a199a3f215f476fb35';

function getWeather(event) {
    // This prevents defult form submission
    event.preventDefault();
    
    const cityName = document.getElementById('searchBar').value;
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('There was an issue with the network response');
            }
            return response.json();
        })
        .then(data => {
            const temperature = data.main.temp;
            const windSpeed = data.wind.speed;
            const humidity = data.main.humidity;

            const weatherInfo = `
                <h2>Weather in ${cityName}:</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
                <p>Humidity: ${humidity}%</p>
            `;

            document.getElementById('activeCity').innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('activeCity').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

document.getElementById('searchBtn').addEventListener('click', getWeather);
