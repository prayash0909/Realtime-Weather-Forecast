import { Box, Card, CardContent, Typography } from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function HourlyForecast({ hourly, unit }) {
  if (!hourly || hourly.length === 0) return null;

  const temperatureUnit = unit === "metric" ? "°C" : "°F";
  const chartData = hourly.map((item) => ({
    time: item.time,
    temperature: Math.round(item.temperature),
    description: item.description,
  }));

  return (
    <Box className="hourly-section">
      <Typography className="details-heading">Next 24 Hours</Typography>

      <Card
        sx={{
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(125, 211, 252, 0.18)",
          borderRadius: "18px",
          padding: "20px 12px",
          marginBottom: "24px",
          color: "#fff",
        }}
      >
        <Typography
          sx={{
            color: "#7dd3fc",
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "20px",
            marginLeft: "12px",
          }}
        >
          Hourly Temperature Trend
        </Typography>

        <Box sx={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.12)"
              />

              <XAxis
                dataKey="time"
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                axisLine={{ stroke: "#475569" }}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                unit="°"
                width={40}
              />

              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #38bdf8",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#7dd3fc" }}
                formatter={(value) => [
                  `${value}${temperatureUnit}`,
                  "Temperature",
                ]}
              />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#38bdf8",
                  stroke: "#ffffff",
                  strokeWidth: 1,
                }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      <Box className="hourly-grid">
        {hourly.map((item) => (
          <Card className="hourly-card" key={item.time}>
            <CardContent>
              <Typography className="hourly-time">{item.time}</Typography>

              <Typography className="hourly-icon">{item.icon}</Typography>

              <Typography className="hourly-temperature">
                {Math.round(item.temperature)}
                {temperatureUnit}
              </Typography>

              <Typography className="hourly-description">
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default HourlyForecast;
