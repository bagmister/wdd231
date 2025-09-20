async function getWeather() {
    const apiKey = 'YOUR_API_KEY';
    const city = 'Magna';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
  
    const cacheTimeKey = 'weatherCacheTime';
    
    const cachedData = localStorage.getItem('weatherData');
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const currentTime = Math.floor(Date.now() / 1000);

    if (cachedData && cachedTime && (currentTime - cachedTime < cacheDuration)) {
        displayWeather(JSON.parse(cachedData));
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, currentTime);
        
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('weatherDisplay').innerHTML = 'Error loading weather data';
    }
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weatherDisplay');
    weatherDiv.innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Conditions: ${data.weather[0].description}</p>
    `;
}

function trackVisits() {
    const visitFooter = document.getElementById('visitFooter');
    const currentTime = Math.floor(Date.now() / 1000);
    
    let visitData = JSON.parse(localStorage.getItem('visitData')) || {
        visitCount: 0,
        lastVisit: null,
        sessionStart: null
    };
    
    let visitMessage = '';
    if (visitData.lastVisit) {
        const secondsSinceLastVisit = currentTime - visitData.lastVisit;
        const daysSinceLastVisit = Math.floor(secondsSinceLastVisit / (24 * 3600));
        if (daysSinceLastVisit > 0) {
            visitMessage = `You last visited ${daysSinceLastVisit} day${daysSinceLastVisit === 1 ? '' : 's'} ago. `;
        }
    }

    visitData.visitCount += 1;
    visitData.lastVisit = currentTime;
    if (!visitData.sessionStart) visitData.sessionStart = currentTime;
    
    const sessionDuration = currentTime - visitData.sessionStart;
    const minutesInSession = Math.floor(sessionDuration / 60);
    
    localStorage.setItem('visitData', JSON.stringify(visitData));
    
    visitFooter.innerHTML = `
        ${visitMessage}
        Visit count: ${visitData.visitCount} | 
        Current session: ${minutesInSession} minute${minutesInSession === 1 ? '' : 's'}
    `;
}

window.onload = function() {
    getWeather();
    trackVisits();
};