import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const SearchBar = styled.input`
  padding: 10px;
  width: 300px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const WeatherInfo = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const WeatherInfoForecast = styled.div`
  display: flex;
  flex-direction:row;
  align-items:flex-start;
  justify-content:center;
  flex-wrap:wrap;
  gap:0 20px;
`;

const WeatherCard = styled.div`
  background: #ced7e3;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  margin-bottom: 20px;
`;

const Temp = styled.div`
  font-size: 2em;
  margin-bottom: 10px;
`;

const Description = styled.div`
  text-transform: capitalize;
  color: #555;
`;

const Details = styled.div`
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
`;

const App = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const fetchWeather = async (city) => {
    const API_KEY = '895284fb2d2c50a520ea537456963d9c';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl),
        axios.get(forecastUrl),
      ]);
      setCurrentWeather(currentResponse.data);
      setForecast(forecastResponse.data.list.filter((reading) => reading.dt_txt.includes("12:00:00")));
    } catch (error) {
      console.error('Error fetching the weather data', error);
    }
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      fetchWeather(city);
    }
  };

  return (
    <Container>
      <h1>Weather Forecast</h1>
      <SearchBar
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleSearch}
      />
      {currentWeather && (
        <WeatherInfo>
          <WeatherCard>
            <Temp>{currentWeather.main.temp}°C</Temp>
            <Description>{currentWeather.weather[0].description}</Description>
            <div>{currentWeather.name}, {currentWeather.sys.country}</div>
            <Details>
              <div>Humidity: {currentWeather.main.humidity}%</div>
              <div>Wind Speed: {currentWeather.wind.speed} m/s</div>
            </Details>
          </WeatherCard>
        </WeatherInfo>
      )}
      {forecast.length > 0 && (
        <WeatherInfo>
          <h2>5-Day Forecast</h2>
          <WeatherInfoForecast>
            {forecast.map((day, index) => (
              <WeatherCard key={index}>
                <Temp>{day.main.temp}°C</Temp>
                <Description>{day.weather[0].description}</Description>
                <div>{new Date(day.dt_txt).toLocaleDateString()}</div>
                <Details>
                  <div>Humidity: {day.main.humidity}%</div>
                  <div>Wind Speed: {day.wind.speed} m/s</div>
                </Details>
              </WeatherCard>
            ))}
          </WeatherInfoForecast>
        </WeatherInfo>
      )}
    </Container>
  );
};

export default App;
