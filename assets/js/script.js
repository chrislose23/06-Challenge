const apiKey = '5842a6da3b2ee4a199a3f215f476fb35';

function getWeather(event) {
    // This prevents defult form submission
    event.preventDefult();

    const cityName = document.getElementById('searchBar').value;
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    console.log(cityName);
    console.log(apiUrl);
}