import React, { useState } from 'react';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [weatherResult, setWeatherResult] = useState(null);

  const getWeather = async () => {
    const cities = cityInput.split(',').map(city => city.trim());

    const response = await fetch('/getWeather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cities }),
    });

    const result = await response.json();
    setWeatherResult(result.weather);
  };

  return (
    <div>
      <h1>Weather App</h1>

      <label htmlFor="cityInput">Enter cities (comma-separated):</label>
      <input
        type="text"
        id="cityInput"
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        placeholder="e.g., Toronto, Mumbai, London"
      />
      <button onClick={getWeather}>Get Weather</button>

      <div>
        <h2>Weather Results</h2>
        {weatherResult && (
          <ul>
            {Object.entries(weatherResult).map(([city, temperature]) => (
              <li key={city}>
                {city}: {temperature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
