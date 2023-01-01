export async function getWeatherJSON(lat, lon, timeZone) {
    return await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,weathercode,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=${timeZone}`
    )
        .then((data) => data.json())
        .then((data) => {
            return {
                current: parseCurrentWeather(data),
                hourly: parseHourlyWeather(data),
                daily: parseDailyWeather(data),
            };
        });
}

export async function getPlaceName(token) {
    let locationURL = `https://ipinfo.io/json?token=${token}`;
    return await fetch(locationURL).then((res) => res.json());
}

function parseCurrentWeather({ current_weather, daily }) {
    const {
        temperature: currentTemp,
        windspeed: windSpeed,
        weathercode: iconCode,
    } = current_weather;

    const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        precipitation_sum: [precip],
    } = daily;

    return {
        currentTemp,
        maxTemp,
        minTemp,
        windSpeed,
        precip,
        iconCode,
    };
}

function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timeStamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            minTemp: Math.round(daily.temperature_2m_min[index]),
        };
    });
}

function parseHourlyWeather({ hourly }) {
    return hourly.time.map((time, index) => {
        return {
            timeStamp: time * 1000,
            precip: hourly.precipitation[index],
            temp: hourly.temperature_2m[index],
            iconCode: hourly.weathercode[index],
            windSpeed: Math.round(hourly.windspeed_10m[index]),
            windDir: Math.round(hourly.winddirection_10m[index]),
        };
    });
}
