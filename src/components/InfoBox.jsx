import { Box, Card, CardContent, Typography } from "@mui/material";

import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import ThunderstormRoundedIcon from "@mui/icons-material/ThunderstormRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import GrainRoundedIcon from "@mui/icons-material/GrainRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import AirRoundedIcon from "@mui/icons-material/Air";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CompressRoundedIcon from "@mui/icons-material/CompressRounded";

function InfoBox({
  info,
  airQuality,
  unit,
  temperatureColor = "inherit",
  isFreezing = false,
}) {
  const condition = (info.description || "").toLowerCase();

  const temperatureUnit = unit === "metric" ? "°C" : "°F";
  const windSpeedUnit = unit === "metric" ? "m/s" : "mph";

  let WeatherIcon = WbSunnyRoundedIcon;

  if (isFreezing) {
    WeatherIcon = AcUnitRoundedIcon;
  } else if (condition.includes("thunder")) {
    WeatherIcon = ThunderstormRoundedIcon;
  } else if (condition.includes("rain") || condition.includes("drizzle")) {
    WeatherIcon = GrainRoundedIcon;
  } else if (condition.includes("snow") || condition.includes("sleet")) {
    WeatherIcon = AcUnitRoundedIcon;
  } else if (
    condition.includes("cloud") ||
    condition.includes("mist") ||
    condition.includes("fog") ||
    condition.includes("haze")
  ) {
    WeatherIcon = CloudRoundedIcon;
  }

  const formatTime = (timestamp, timezoneOffset = 0) => {
    if (!timestamp) return "N/A";

    const date = new Date((timestamp + timezoneOffset) * 1000);

    return date.toLocaleTimeString("en-IN", {
      timeZone: "UTC",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const metrics = [
    {
      label: "FEELS LIKE",
      value: `${Math.round(info.feelsLike)}${temperatureUnit}`,
      icon: ThermostatRoundedIcon,
    },
    {
      label: "HUMIDITY",
      value: `${info.humidity}%`,
      icon: WaterDropRoundedIcon,
    },
    {
      label: "WIND SPEED",
      value: `${Number(info.windSpeed).toFixed(1)} ${windSpeedUnit}`,
      icon: AirRoundedIcon,
    },
    {
      label: "AIR QUALITY",
      value: airQuality || "Unavailable",
      icon: AirRoundedIcon,
    },
    {
      label: "SUNRISE",
      value: formatTime(info.sunrise, info.timezone),
      icon: WbSunnyRoundedIcon,
    },
    {
      label: "SUNSET",
      value: formatTime(info.sunset, info.timezone),
      icon: WbTwilightRoundedIcon,
    },
    {
      label: "VISIBILITY",
      value:
        info.visibility != null
          ? `${(info.visibility / 1000).toFixed(1)} km`
          : "N/A",
      icon: VisibilityRoundedIcon,
    },
    {
      label: "PRESSURE",
      value: info.pressure != null ? `${info.pressure} hPa` : "N/A",
      icon: CompressRoundedIcon,
    },
  ];

  return (
    <Box className="weather-content">
      <Card
        className={`main-weather-card ${
          isFreezing ? "freezing-weather-card" : ""
        }`}
        sx={
          isFreezing
            ? {
                background:
                  "linear-gradient(135deg, #e0f2fe, #f0f9ff, #dbeafe)",
                border: "1px solid #93c5fd",
                color: "#164e63",
              }
            : {}
        }
      >
        <CardContent className="main-weather-content">
          <Box className="weather-location">
            <Typography className="location-label">CURRENT WEATHER</Typography>

            <Typography className="city-name">
              {info.city}, {info.country}
            </Typography>

            <Typography className="weather-date">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Box>

          <Box className="weather-main">
            <WeatherIcon
              className="main-weather-icon"
              sx={{
                color: isFreezing ? "#0284c7" : temperatureColor,
              }}
            />

            <Box>
              <Typography
                className="temperature"
                sx={{ color: temperatureColor }}
              >
                {Math.round(info.temperature)}
                <span>{temperatureUnit}</span>
              </Typography>

              <Typography className="weather-description">
                {info.description}
              </Typography>

              {isFreezing && (
                <Typography
                  sx={{
                    color: "#0369a1",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    mt: 1,
                  }}
                >
                  Freezing conditions ❄️
                </Typography>
              )}
            </Box>
          </Box>

          <Typography className="weather-caption">Have a great day!</Typography>
        </CardContent>
      </Card>

      <Typography className="details-heading">Today's Highlights</Typography>

      <Box className="weather-metrics">
        {metrics.map((item) => {
          const MetricIcon = item.icon;

          return (
            <Card className="metric-card" key={item.label}>
              <CardContent className="metric-content">
                <Box className="metric-icon-box">
                  <MetricIcon className="metric-icon" />
                </Box>

                <Typography className="metric-label">{item.label}</Typography>

                <Typography className="metric-value">{item.value}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

export default InfoBox;
