const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const searchInput = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

function searchWeather() {
    const APIKey = '93481b90869c53d155f4549b39791d87'; // Certifique-se de que esta é uma chave de API válida
    const city = searchInput.value;

    if (city === '') {
        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
        container.style.height = '100px';
        error404.classList.remove('active'); // Esconder erro quando o input está vazio
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => {
            if (!response.ok) {
                // Se a resposta não for ok, verifica se há um erro 404
                throw new Error('Cidade não encontrada');
            }
            return response.json();
        })
        .then(json => {
            // Verifica se a resposta contém uma cidade válida
            if (json.cod === '404') {
                container.style.height = '400px'; // Ajusta a altura para exibir o erro
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active'); // Mostra a imagem de erro 404
                return;
            }

            // Se cidade válida, redefine a altura do container
            container.style.height = '555px';
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            error404.classList.remove('active'); // Esconde a mensagem de erro

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            // Atualiza a imagem do tempo com base na condição climática
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

            // Atualiza a temperatura
            temperature.innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
            // Atualiza a descrição do clima
            description.innerHTML = json.weather[0].description.charAt(0).toUpperCase() + json.weather[0].description.slice(1);
            // Atualiza a umidade
            humidity.innerHTML = `${json.main.humidity}%`;
            // Atualiza a velocidade do vento
            wind.innerHTML = `${Math.round(json.wind.speed)}Km/h`;
        })
        .catch(err => {
            console.error(err); // Loga o erro no console
            container.style.height = '400px'; // Ajusta a altura para exibir o erro
            error404.classList.add('active'); // Mostra a imagem de erro 404
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
        });
}

search.addEventListener('click', searchWeather);

// Adiciona um ouvinte para a tecla ENTER
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchWeather();
    }
});
