const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {
    const APIKey = '93481b90869c53d155f4549b39791d87'; // Ensure this is a valid API key
    const city = document.querySelector('.search-box input').value;

    if (city === '') {
        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
        container.style.height = '100px';
        error404.classList.remove('active'); // Hide error when input is empty
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => {
            if (!response.ok) {
                // If the response is not ok, check for 404 error
                throw new Error('Cidade não encontrada');
            }
            return response.json();
        })
        .then(json => {
            // Check if the response contains a valid city
            if (json.cod === '404') {
                container.style.height = '400px'; // Adjust height for error display
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active'); // Show 404 image
                return;
            }

            // If valid city, reset container height
            container.style.height = '555px';
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            error404.classList.remove('active'); // Hide error message

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            // Update weather image based on weather condition
            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Mist':
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = 'images/cloud.png';
            }

            // Update temperature
            temperature.innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
            // Update weather description
            description.innerHTML = json.weather[0].description.charAt(0).toUpperCase() + json.weather[0].description.slice(1);
            // Update humidity
            humidity.innerHTML = `${json.main.humidity}%`;
            // Update wind speed
            wind.innerHTML = `${Math.round(json.wind.speed)}Km/h`;
        })
        .catch(err => {
            console.error(err); // Log the error to console
            container.style.height = '400px'; // Adjust height for error display
            error404.classList.add('active'); // Show 404 image
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
        });
});
