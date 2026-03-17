import React, { useState } from "react";
import "./Navbar.css";

function Navbar({
  onSearch,
  isLoading,
  unit,
  onUnitChange,
  onUseCurrentLocation,
  isLocating,
}) {
  const [cityInput, setCityInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const city = cityInput.trim();

    if (!city) {
      return;
    }

    onSearch(city);
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">W</div>
        <div>
          <p className="navbar__eyebrow">Live Weather</p>
          <h1 className="navbar__title">WeatherScope</h1>
        </div>
      </div>

      <form className="navbar__search" role="search" onSubmit={handleSubmit}>
        <label className="navbar__search-label" htmlFor="city-search">
          Search city
        </label>
        <input
          className="navbar__search-input"
          id="city-search"
          type="search"
          name="city"
          placeholder="Search for a city"
          value={cityInput}
          onChange={(event) => setCityInput(event.target.value)}
        />
        <button className="navbar__search-button" type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="navbar__actions">
        <div className="navbar__units" aria-label="Temperature unit">
          <button
            className={`navbar__unit ${unit === "C" ? "navbar__unit--active" : ""}`}
            type="button"
            onClick={() => onUnitChange("C")}
          >
            C
          </button>
          <button
            className={`navbar__unit ${unit === "F" ? "navbar__unit--active" : ""}`}
            type="button"
            onClick={() => onUnitChange("F")}
          >
            F
          </button>
        </div>

        <button
          className="navbar__location"
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
        >
          {isLocating ? "Locating..." : "Current Location"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
