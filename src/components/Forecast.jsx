import { Box, Card, CardContent, Typography } from "@mui/material";

function Forecast({ forecast, unit }) {
  if (!forecast || forecast.length === 0) return null;
  const temperatureUnit = unit === "metric" ? "°C" : "°F";

  return (
    <Box className="forecast-section">
      <Typography className="details-heading">
        5-Day Weather Forecast
      </Typography>

      <Box className="forecast-grid">
        {forecast.map((day) => (
          <Card className="forecast-card" key={day.date}>
            <CardContent>
              <Typography className="forecast-date">{day.date}</Typography>

              <Typography className="forecast-icon">{day.icon}</Typography>

              <Typography className="forecast-temperature">
                {Math.round(day.temperature)}
                {temperatureUnit}
              </Typography>

              <Typography className="forecast-description">
                {day.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default Forecast;
