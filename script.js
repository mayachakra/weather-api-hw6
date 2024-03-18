//event listener for the search form
    //get search-input which is the city
        //if empty alert
    //define apiKey and apiURL
    //fetch the apiURL
        //.then response
        //.then data
            //const city name from data and forecast data.list
            //this will have the current and fiveday forecasts
            //two diff consts
            //catch the error and have an alert and error message
//function to render forecast based on forecastData and containerID
//add forecast-box and containerId
    //forecast for each item

document.getElementById('search-form').addEventListener('submit',function(event){
    event.preventDefault();
    const citySearch = document.getElementById('search-input').value.trim();
    if(citySearch === ''){
        alert('Please enter a city name.');
        return;
    }
    const apiKey = 'fc3400b3917a8e930ce3cc2ea1688ad9';
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&appid=${apiKey}&units=metric`;
    fetchForecast(apiURL);    
});
    function fetchForecast(apiURL){
    fetch(apiURL)
        .then(response =>{
            if (!response.ok){
                throw new Error('Network response not working');
            }
            return response.json();
        })
        .then( data =>{
            const cityName = data.city.name;
            const forecast = data.list; //api data
            document.getElementById('result-text').innerHTML = cityName;
            document.getElementById('result-content').innerHTML = '';
            const currentDate = new Date();
            const currentForecast = [];
            const fiveDayForecast = [];
            let lastDate = null;
            forecast.forEach(item =>{
                const dateTime = new Date(item.dt * 1000);
                const date = dateTime.getDate();
                const temperature = item.main.temp;
                const description = item.weather[0].description;
                const windSpeed = item.wind.speed;
                const humidity = item.main.humidity;

                if(date !== lastDate){
                    if(dateTime.getDate() === currentDate.getDate()) {
                        currentForecast.push({cityName, dateTime, temperature, description, windSpeed, humidity});
                    } else{
                        fiveDayForecast.push({dateTime, temperature, description, windSpeed, humidity});
    
                    }
                    lastDate = date;
                }
               
            });
            
            renderForecast(currentForecast, 'current-forecast');
            renderForecast(fiveDayForecast, 'five-day-forecast');
            savePastSearch(cityName, apiURL);
        })
        .catch(error => {
            console.error('Error', error);
            alert('Problem fetching data. Try again.');
        });
    }


function renderForecast(forecastData, containerID){
    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-box');
    forecastContainer.classList.add(containerID);

    forecastData.forEach(item => {
        const {dateTime, temperature, description, windSpeed, humidity} = item;
        const forecastCard = document.createElement('div');

        const dateTimeEl = document.createElement('h4');
        dateTimeEl.textContent = `Date and Time: ${dateTime.toLocaleDateString()}`;
        forecastCard.appendChild(dateTimeEl);

        const temperatureEl = document.createElement('p');
        temperatureEl.textContent = `Temperature: ${temperature}°C`;
        forecastCard.appendChild(temperatureEl);

        const descriptionEl = document.createElement('p');
        descriptionEl.textContent = `Description: ${description}`;
        forecastCard.appendChild(descriptionEl);


        const windEl = document.createElement('p');
        windEl.textContent = `Wind Speed: ${windSpeed} m/s`;
        forecastCard.appendChild(windEl);


        const humidityEl = document.createElement('p');
        descriptionEl.textContent = `Humidity: ${humidity}%`;
        forecastCard.appendChild(humidityEl);
        forecastContainer.appendChild(forecastCard);
    });
    document.getElementById('result-content').appendChild(forecastContainer);
}

function savePastSearch(cityName, apiURL){
    const pastSearchButton = document.createElement('h6');
    pastSearchButton.textContent = cityName;
    pastSearchButton.classList.add('past-search');
    pastSearchButton.addEventListener('click', function(){
        alert(`Searching for: ${cityName}`);
        fetchForecast(apiURL);
    });
    document.getElementById('past-searches').appendChild(pastSearchButton);
}
