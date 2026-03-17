import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import useFetchCity from "./customHooks/useFetchCity";
import "./App.css";

function App() {
  const [query, setQuery] = useState("London");
  const [unit, setUnit] = useState("C");
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const { weather, loading, error } = useFetchCity(query);

  const temperature = weather
    ? unit === "C"
      ? Math.round(weather.current.temp_c)
      : Math.round(weather.current.temp_f)
    : null;

  const feelsLike = weather
    ? unit === "C"
      ? Math.round(weather.current.feelslike_c)
      : Math.round(weather.current.feelslike_f)
    : null;

  const windSpeed = weather
    ? unit === "C"
      ? `${Math.round(weather.current.wind_kph)} km/h`
      : `${Math.round(weather.current.wind_mph)} mph`
    : "";

  const locationName = weather
    ? `${weather.location.name}, ${weather.location.country}`
    : query;

  const weatherIcon = weather?.current?.condition?.icon
    ? `https:${weather.current.condition.icon}`
    : "";

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setQuery(`${latitude},${longitude}`);
        setIsLocating(false);
      },
      (geoError) => {
        setLocationError(
          geoError.message || "Unable to access your current location.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 120000 },
    );
  };

  return (
    <div className="app-shell">
      <Navbar
        onSearch={setQuery}
        isLoading={loading}
        unit={unit}
        onUnitChange={setUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
      />

      <main className="weather-layout">
        <section className="weather-card">
          <p className="weather-card__label">Current City</p>
          <h2 className="weather-card__city">{locationName}</h2>

          {loading && <p className="weather-card__status">Loading weather data...</p>}
          {error && <p className="weather-card__error">{error}</p>}
          {locationError && <p className="weather-card__error">{locationError}</p>}

          {!loading && !error && !locationError && weather && (
            <div className="weather-card__body">
              <div className="weather-card__head">
                <p className="weather-card__temp">
                  {temperature}
                  {"\u00B0"}
                  {unit}
                </p>
                {weatherIcon && (
                  <img
                    className="weather-card__icon"
                    src={weatherIcon}
                    alt={weather.current.condition.text}
                  />
                )}
              </div>
              <p className="weather-card__condition">{weather.current.condition.text}</p>
              <div className="weather-card__meta">
                <p>
                  Feels like: {feelsLike}
                  {"\u00B0"}
                  {unit}
                </p>
                <p>Humidity: {weather.current.humidity}%</p>
                <p>Wind: {windSpeed}</p>
              </div>
              <p className="weather-card__updated">
                Last updated: {weather.current.last_updated}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
