import { useState, useCallback } from "react";
import "./App.css";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WbCloudyRoundedIcon from "@mui/icons-material/WbCloudyRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";

import InfoBox from "./components/InfoBox";
import Forecast from "./components/Forecast";
import HourlyForecast from "./components/HourlyForecast";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("metric");

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [airQuality, setAirQuality] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  // Stores the last searched city or current-location coordinates.
  const [activeQuery, setActiveQuery] = useState("");

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const getWeatherFromAPI = useCallback(
    async (weatherURL, forecastURL) => {
      if (!API_KEY) {
        setError("API key is missing. Please check your .env file.");
        console.error("Weather API Error: API key is missing.");
        return;
      }

      setLoading(true);
      setError("");
      setAirQuality(null);

      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(weatherURL),
          fetch(forecastURL),
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (!weatherResponse.ok) {
          throw new Error(weatherData.message || "Weather data not available.");
        }

        if (!forecastResponse.ok) {
          throw new Error(
            forecastData.message || "Forecast data not available.",
          );
        }

        const currentUpdateTime = new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        setLastUpdated(currentUpdateTime);

        setWeather({
          city: weatherData.name,
          country: weatherData.sys.country,
          temperature: weatherData.main.temp,
          feelsLike: weatherData.main.feels_like,
          humidity: weatherData.main.humidity,
          description: weatherData.weather[0].description,
          windSpeed: weatherData.wind.speed,
          sunrise: weatherData.sys.sunrise,
          sunset: weatherData.sys.sunset,
          visibility: weatherData.visibility,
          pressure: weatherData.main.pressure,
          timezone: weatherData.timezone,
        });

        setCity(weatherData.name);

        // Air quality information
        try {
          const airQualityURL =
            `https://api.openweathermap.org/data/2.5/air_pollution?` +
            `lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}` +
            `&appid=${API_KEY}`;

          const airQualityResponse = await fetch(airQualityURL);
          const airQualityData = await airQualityResponse.json();

          if (!airQualityResponse.ok) {
            throw new Error(
              airQualityData.message || "Air quality data not available.",
            );
          }

          const airQualityLabels = [
            "Good",
            "Fair",
            "Moderate",
            "Poor",
            "Very poor",
          ];

          const airQualityIndex = airQualityData.list[0].main.aqi;

          setAirQuality(airQualityLabels[airQualityIndex - 1] || "Unavailable");
        } catch (airQualityError) {
          console.error("Air Quality API Error:", airQualityError);
          setAirQuality("Unavailable");
        }

        // Weather icons
        const getWeatherIcon = (condition) => {
          if (condition === "Clear") return "☀️";
          if (condition === "Clouds") return "☁️";
          if (condition === "Rain" || condition === "Drizzle") return "🌧️";
          if (condition === "Snow") return "❄️";
          if (condition === "Thunderstorm") return "⛈️";

          if (
            condition === "Mist" ||
            condition === "Fog" ||
            condition === "Haze"
          ) {
            return "🌫️";
          }

          return "🌤️";
        };

        // Next 24 hours: 8 intervals of 3 hours
        const hourlyData = forecastData.list.slice(0, 8);

        setHourly(
          hourlyData.map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            temperature: item.main.temp,
            description: item.weather[0].description,
            icon: getWeatherIcon(item.weather[0].main),
          })),
        );

        // One forecast entry per day, selected near 12 PM
        const dailyForecast = forecastData.list.filter((item) =>
          item.dt_txt.includes("12:00:00"),
        );

        setForecast(
          dailyForecast.slice(0, 5).map((item) => ({
            date: new Date(item.dt * 1000).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            }),
            temperature: item.main.temp,
            description: item.weather[0].description,
            icon: getWeatherIcon(item.weather[0].main),
          })),
        );
      } catch (err) {
        console.error("Weather API Error:", err);

        if (!navigator.onLine) {
          setError("No internet connection. Please check your network.");
        } else if (err instanceof TypeError) {
          setError(
            "Unable to connect to the weather service. Please try again.",
          );
        } else {
          setError(err.message || "Something went wrong.");
        }

        setWeather(null);
        setForecast([]);
        setHourly([]);
        setAirQuality(null);
        setLastUpdated("");
      } finally {
        setLoading(false);
      }
    },
    [API_KEY],
  );

  // Create weather and forecast URLs
  const getWeatherURLs = useCallback(
    (query, selectedUnit) => {
      const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?` +
        `${query}&appid=${API_KEY}&units=${selectedUnit}`;

      const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?` +
        `${query}&appid=${API_KEY}&units=${selectedUnit}`;

      return { weatherURL, forecastURL };
    },
    [API_KEY],
  );

  // Search weather by city
  const getWeatherInfo = useCallback(
    (searchCity) => {
      const trimmedCity = searchCity.trim();

      if (trimmedCity.length < 2) {
        setSearchError(
          trimmedCity.length === 0
            ? "Please enter a city name."
            : "City name must contain at least 2 characters.",
        );
        return;
      }

      setSearchError("");
      setError("");

      const query = `q=${encodeURIComponent(trimmedCity)}`;

      setActiveQuery(query);

      const { weatherURL, forecastURL } = getWeatherURLs(query, unit);

      getWeatherFromAPI(weatherURL, forecastURL);
    },
    [unit, getWeatherFromAPI, getWeatherURLs],
  );

  // Current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const coordinates = `lat=${latitude}&lon=${longitude}`;

        setActiveQuery(coordinates);

        const { weatherURL, forecastURL } = getWeatherURLs(coordinates, unit);

        getWeatherFromAPI(weatherURL, forecastURL);
      },
      (locationError) => {
        setLoading(false);

        if (locationError.code === 1) {
          setError("Location permission denied. Please allow location access.");
        } else if (locationError.code === 2) {
          setError("Your location could not be detected. Please try again.");
        } else {
          setError("Location request timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Celsius / Fahrenheit toggle with automatic refresh
  const handleUnitToggle = () => {
    const nextUnit = unit === "metric" ? "imperial" : "metric";

    setUnit(nextUnit);

    if (activeQuery) {
      const { weatherURL, forecastURL } = getWeatherURLs(activeQuery, nextUnit);

      getWeatherFromAPI(weatherURL, forecastURL);
    }
  };

  // Search validation
  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setSearchError("Please enter a city name.");
      return;
    }

    if (trimmedCity.length < 2) {
      setSearchError("City name must contain at least 2 characters.");
      return;
    }

    setSearchError("");
    getWeatherInfo(trimmedCity);
  };

  // Freezing temperature detection
  const freezingLimit = unit === "metric" ? 0 : 32;
  const isFreezing = weather !== null && weather.temperature <= freezingLimit;

  // Temperature-based text color
  const temperatureColor =
    weather === null
      ? "inherit"
      : weather.temperature > (unit === "metric" ? 30 : 86)
        ? "#ef4444"
        : weather.temperature < (unit === "metric" ? 10 : 50)
          ? "#38bdf8"
          : "inherit";

  return (
    <Box
      className={`weather-app ${isFreezing ? "winter-weather" : ""}`}
      sx={{
        minHeight: "100vh",
        background: isFreezing
          ? "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)"
          : undefined,
        transition: "background 0.4s ease",
      }}
    >
      <Box className="dashboard-container">
        <Box className="top-header">
          <Box className="brand">
            <WbCloudyRoundedIcon className="brand-icon" />

            <Typography className="brand-name">
              Sky<span>Cast</span>
            </Typography>
          </Box>

          <Typography className="header-tagline">
            YOUR PERSONAL WEATHER COMPANION
          </Typography>
        </Box>

        <Box className="welcome-section">
          <Typography className="welcome-title">Weather Forecast</Typography>

          <Typography className="welcome-subtitle">
            Discover the weather conditions around the world.
          </Typography>
        </Box>

        <Box component="form" className="search-box" onSubmit={handleSearch}>
          <TextField
            fullWidth
            placeholder="Search city name..."
            variant="outlined"
            value={city}
            error={Boolean(searchError)}
            helperText={searchError}
            onChange={(event) => {
              setCity(event.target.value);

              if (searchError) {
                setSearchError("");
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnRoundedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    disabled={loading}
                    className="search-button"
                    aria-label="Search weather"
                  >
                    <SearchRoundedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className="location-button-wrapper">
          <Button
            variant="outlined"
            onClick={handleUnitToggle}
            disabled={loading}
            className="location-button"
            aria-label={`Switch to ${
              unit === "metric" ? "Fahrenheit" : "Celsius"
            }`}
          >
            Switch to °{unit === "metric" ? "F" : "C"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<MyLocationRoundedIcon />}
            onClick={handleCurrentLocation}
            disabled={loading}
            className="location-button"
          >
            Use My Location
          </Button>
        </Box>

        {error && (
          <Alert severity="error" className="weather-alert">
            {error}
          </Alert>
        )}

        {loading && (
          <Box className="loading-area">
            <CircularProgress sx={{ color: "#7dd3fc" }} />
            <Typography>Getting weather updates...</Typography>
          </Box>
        )}

        {!loading && weather && (
          <>
            {isFreezing && (
              <Alert severity="info" className="weather-alert">
                ❄️ Freezing conditions! Stay warm and take care.
              </Alert>
            )}

            <InfoBox
              info={weather}
              airQuality={airQuality}
              unit={unit}
              temperatureColor={temperatureColor}
              isFreezing={isFreezing}
            />

            <Typography
              className="last-updated"
              sx={{
                textAlign: "center",
                mt: 2,
                mb: 2,
                color: "text.secondary",
                fontSize: "0.85rem",
              }}
            >
              Last Updated: {lastUpdated}
            </Typography>

            <HourlyForecast hourly={hourly} unit={unit} />

            <Forecast forecast={forecast} unit={unit} />
          </>
        )}

        <Box className="dashboard-footer">
          <Typography>SkyCast Weather Dashboard</Typography>
          <Typography>Weather data powered by OpenWeather</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default WeatherApp;
