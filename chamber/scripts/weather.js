const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');
const forecastDiv = document.querySelector('#weatherforcastBlock');
const weatherSingle = document.querySelector('#weather');
const url = 'https://api.openweathermap.org/data/2.5/weather?lat=40.71&lon=-112.10&units=imperial&appid=e1a74b86df31d3f79449799eb8ed7845';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=40.71&lon=-112.10&units=imperial&appid=e1a74b86df31d3f79449799eb8ed7845';

async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayResults(data, true);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error('Error fetching current weather:', error);
    }
}

async function apiForecastFetch() {
    try {
        const response = await fetch(forecastUrl);
        if (response.ok) {
            const data = await response.json();
            displayResults(data, false);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function displayResults(data, single) {
    if (single) {
        currentTemp.textContent = `${Math.round(data.main.temp)}°F`;
        const iconSrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        const desc = data.weather[0].description;
        weatherIcon.setAttribute('src', iconSrc);
        weatherIcon.setAttribute('alt', desc);
        captionDesc.textContent = desc;
    } else {
        const dailyForecasts = [];
        const seenDates = new Set();

        data.list.forEach(forecast => {
            const dateTime = new Date(forecast.dt * 1000);
            const date = dateTime.toISOString().split('T')[0];
            const hour = dateTime.getHours();

            if (hour === 12 && !seenDates.has(date) && dailyForecasts.length < 3) {
                dailyForecasts.push(forecast);
                seenDates.add(date);
            }
        });
        
        dailyForecasts.forEach(forecast => {
            const temp = Math.round(forecast.main.temp);
            const iconSrc = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
            const desc = forecast.weather[0].description;
            const dateTime = new Date(forecast.dt * 1000);
            const dateStr = dateTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const forecastItem = document.createElement('div');
            forecastItem.innerHTML = `
                <p>${dateStr}: ${temp}°F</p>
                <img src="${iconSrc}" alt="${desc}" style="width: 50px;">
                <p>${desc}</p>
            `;
            forecastDiv.appendChild(forecastItem);
        });

        if (dailyForecasts.length === 0) {
            forecastDiv.innerHTML += '<p>No forecast data available.</p>';
        }
    }
}


apiFetch();
apiForecastFetch();