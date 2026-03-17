import { useEffect, useState } from "react";
import axios from "axios";

function useFetchCity(query) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiKey =
      import.meta.env.VITE_WEATHER_API_KEY ||
      import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    if (!query || !query.trim()) {
      setWeather(null);
      setError("");
      setLoading(false);
      return;
    }

    if (!apiKey) {
      setWeather(null);
      setError("Missing VITE_WEATHER_API_KEY in .env");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchCurrentWeather() {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://api.weatherapi.com/v1/current.json",
          {
            signal: controller.signal,
            params: {
              key: apiKey,
              q: query.trim(),
              aqi: "no",
            },
          },
        );

        setWeather(response.data);
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") {
          return;
        }

        setWeather(null);
        setError(
          err?.response?.data?.error?.message ||
            err.message ||
            "Something went wrong while fetching weather.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentWeather();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { weather, loading, error };
}

export default useFetchCity;
