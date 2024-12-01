import React, { useState } from 'react';
import './WeatherApp.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false); // כדי לדעת אם לחצו על הכפתור

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name!');
      setWeatherData(null); // מאפס את המידע במקרה של שגיאה
      setHasFetched(false);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/weather?city=${city}`);
      const data = await response.json();
  
      if (data.error) {
        setError('City not found. Please try again.');
        setWeatherData(null); // מאפס את המידע במקרה של שגיאה
      } else {
        setWeatherData(data); // מעדכן את הנתונים עם העיר החדשה
        setError(''); // מנקה שגיאות אם הכל עבר בהצלחה
      }
      setHasFetched(true); // מסמן שלחיצה התבצעה
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setWeatherData(null);
      setHasFetched(false);
    }
  };
  

  const renderWeatherInfo = () => {
    if (!weatherData) {
      return hasFetched ? <p>Fetching data, please wait...</p> : null;
    }
    console.log(weatherData);
  
    return (
        <div className="weather-info">
          <h2>{weatherData.location.name}</h2>
          <div>{weatherData.location.country}</div> {/* רק המדינה */}
          <div>{weatherData.location.localtime}</div>
          <div className="temp">{weatherData.current.temp_c}°<div className="status">{weatherData.current.condition.text}</div></div>
          
          {/* נתוני מזג האוויר בשורה אחת */}
          <div className="details-row">
            <p>Precipitation<br /> {weatherData.current.precip_mm} mm</p>
            <p>Humidity <br />{weatherData.current.humidity} %</p>
            <p>Wind <br /> {weatherData.current.wind_kph} km/h</p>
          </div>
        </div>
      );
  };
  

  return (
    <div className="weather-app">
      <div className="header">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <p>Use our weather app <br /> to see the weather <br /> around the world</p>
        <div className="input-container">
        <label htmlFor="city-input" className="input-label">City name</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>Check</button>
        </div>
        
      </div>

      {/* רק אם המידע קיים או לחצו על כפתור הצג את החלק */}
      {hasFetched && (
        <div className={`main-container ${weatherData ? 'show' : ''}`}>
          {renderWeatherInfo()}
        </div>
      )}

      {error && <div className="error-container">{error}</div>}
    </div>
  );
};

export default WeatherApp;
