# 🌦️ SkyCast – Real-Time Weather Forecast

SkyCast is a responsive weather forecasting web application built with React and Material UI. It uses the OpenWeatherMap API to display real-time weather information for searched cities and the user's current location.

## ✨ Features

- Search weather by city name
- Detect current location using browser geolocation
- Real-time temperature and weather conditions
- Celsius and Fahrenheit temperature conversion
- Dynamic weather icons based on weather conditions
- 5-Day weather forecast
- Hourly weather forecast
- Humidity, wind speed and feels-like temperature
- Sunrise and sunset timings
- Visibility and atmospheric pressure
- Air quality information
- Search validation and error handling
- Temperature-based color indicators
- Winter-style background and snowflake icon at 0°C or below
- Responsive design for desktop and mobile screens
- Last Updated timestamp

## 🛠️ Tech Stack

- React.js
- JavaScript
- Material UI (MUI)
- CSS3
- OpenWeatherMap API
- Vite

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/prayash0909/Realtime-Weather-Forecast.git
```

### 2. Open the project folder

```bash
cd Realtime-Weather-Forecast
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the API key

Create a `.env` file in the project root directory and add your OpenWeatherMap API key:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your own API key.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal to view the application.

## 🔑 API

Weather data is provided by the [OpenWeatherMap API](https://openweathermap.org/api).

You need your own API key to run this project locally.

## 📁 Project Structure

```text
Realtime-Weather-Forecast/
├── public/
├── src/
│   ├── components/
│   │   ├── InfoBox.jsx
│   │   ├── Forecast.jsx
│   │   └── HourlyForecast.jsx
│   ├── WeatherApp.jsx
│   ├── App.css
│   └── index.css
├── .env
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## 👨‍💻 Author

**Prayash Kumar Sabar**

- GitHub: [prayash0909](https://github.com/prayash0909)
- LinkedIn: [Prayash Kumar Sabar](https://www.linkedin.com/in/prayashkumarsabar/)

---

⭐ If you find this project useful, consider giving it a star!
