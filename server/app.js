const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5173;

app.use(bodyParser.json());

// In-memory array to store cities
let citiesData = [];

app.post('/getWeather', async (req, res) => {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
        return res.status(400).json({ error: 'Invalid input format' });
    }

    try {
        // Fetch weather data from OpenWeatherMap for each city
        const weatherData = await Promise.all(
            cities.map(async (city) => {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d63875d6f3b1e216ea5715518abe0217`
                );
                const temperature = response.data.main.temp;
                return { [city]: `${temperature}°C` };
            })
        );

        // Update in-memory array with current cities
        citiesData = cities.map(city => ({ name: city }));

        // Prepare and send response
        const result = { weather: Object.assign({}, ...weatherData) };
        res.json(result);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
