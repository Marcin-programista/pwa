const input = document.querySelector('input');
const button = document.querySelector('button');
const errorMsg = document.querySelector('p.error_message');
const date = document.querySelector('p.date');
const cityName = document.querySelector('h2.city_name');
const weatherImg = document.querySelector('img.weather_img');
const temp = document.querySelector('p.temp');
const description = document.querySelector('p.description');
const feelsLike = document.querySelector('span.feels_like');
const humidity = document.querySelector('span.humidity');
const pressure = document.querySelector('span.pressure');
const windSpeed = document.querySelector('span.wind_speed');
const clouds = document.querySelector('span.clouds');
const visibility = document.querySelector('span.visibility');
const pollutionImg = document.querySelector('img.pollution_img');
const pollutionValue = document.querySelector('span.pollution_value');

const apiInfo = {
link : 'https://api.openweathermap.org/data/2.5/weather?q=',
key : '&appid=3b993110130d8e7eec321bf7ae2001d7',
units : '&units=metric',
lang : '&lang=pl'
}

function getWeatherInfo () {
    const apiInfoCity = input.value || "Gdańsk";
    const URL = `${apiInfo.link}${apiInfoCity}${apiInfo.key}${apiInfo.units}${apiInfo.lang}`;
    axios.get(URL).then((response) => {
        console.log(response.data);

        weatherImg.src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
        const utcTime = new Date(response.data.dt * 1000);
        const localTime = new Date(utcTime.getTime() + response.data.timezone * 1000)
        date.textContent = localTime.toLocaleString("pl-PL", {
            weekday : "long",
            day : "numeric",
            month : "long",
            year : "numeric",
            //hour : "2-digit",
            //minute : "2-digit"
        });
        cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        temp.textContent = `${Math.round(response.data.main.temp)}°C`;
        description.textContent = `${response.data.weather[0].description}`;
        feelsLike.textContent = `${Math.round(response.data.main.feels_like)}°C`;
        humidity.textContent = `${response.data.main.humidity}%`;
        pressure.textContent = `${response.data.main.pressure}hPa`;
        windSpeed.textContent = `${response.data.wind.speed * 3.6}km/h`;
        clouds.textContent = `${response.data.clouds.all}%`;
        visibility.textContent = `${response.data.visibility / 1000} km`;
        errorMsg.textContent = ``;

        const POLLUTION_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}${apiInfo.key}`;
        //console.log(POLLUTION_URL);

        axios.get(POLLUTION_URL).then((res) => {
            pollutionValue.textContent = `${res.data.list[0].components.pm2_5}`;
        })
    }).catch((error) => {
        errorMsg.textContent = `${error.response.data.cod} - ${error.response.data.message}`;
        weatherImg.src = ``;
        [date, cityName, temp, description, feelsLike, pressure, humidity, windSpeed, visibility, clouds].forEach((el) => {
            el.textContent = ``;
        })
    }).finally(() => {
        input.value = ``;
    })
}
button.addEventListener('click', getWeatherInfo);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherInfo();
    }
})
