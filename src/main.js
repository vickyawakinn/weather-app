import "/style.css";

import { API_KEY } from "../systemKeys";
import { getWeatherJSON, getPlaceName } from "./weather";
import { chart } from "./weatherChart";
import { ICON_MAP } from "./iconMap";

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dayCardTemplate = document.getElementById("day-card-template");
const dailySection = document.querySelector(".daily-main");

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" });

navigator.geolocation.getCurrentPosition(positionSuccess, positionFailed);

function positionSuccess({ coords }) {
    // getting location place name
    getPlaceName(API_KEY.KEY).then((data) => renderAddress(data));

    // getting location weather
    getWeatherJSON(
        coords.latitude,
        coords.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    ).then((data) => renderFields(data));
}

function renderAddress(data) {
    setValue("address", data.city);
}

function positionFailed(err) {
    alert("There was an Error getting your location. Please try again.");
    console.log(err);
}

function renderFields(data) {
    renderCurrentFields(data);
    renderDailyFields(data);
    renderHourlyFields(data);
    document.body.classList.remove("blurred");
}

function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconURL(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

function renderHourlyFields({ hourly }) {
    const tempData = [];
    const windData = [];
    const precipData = [];
    const hours = hourly.slice(0, 24);
    hours.forEach((hour) => {
        let numbericHour = HOUR_FORMATTER.format(hour.timeStamp);
        tempData.push({
            timeStamp: numbericHour,
            temp: hour.temp,
        });
        windData.push({
            timeStamp: numbericHour,
            windSpeed: hour.windSpeed,
            windDir: hour.windDir,
        });
        precipData.push({
            timeStamp: numbericHour,
            precip: hour.precip,
        });
    });
    chart(tempData);
}

function renderDailyFields({ daily }) {
    setValue("current-day", DAY_FORMATTER.format(daily[0].timeStamp));
    dailySection.innerHTML = "";
    daily.forEach((day) => {
        const element = dayCardTemplate.content.cloneNode(true);
        element.querySelector("[data-daily-icon]").src = getIconURL(
            day.iconCode
        );
        setValue("day-temp-max", day.maxTemp, { parent: element });
        setValue("day-temp-min", day.minTemp, { parent: element });
        setValue("day", DAY_FORMATTER.format(day.timeStamp), {
            parent: element,
        });
        dailySection.append(element);
    });
}

function renderCurrentFields({ current }) {
    document.querySelector("[data-current-icon]").src = getIconURL(
        current.iconCode
    );
    setValue("current-temp", current.currentTemp);
    setValue("current-max", current.maxTemp);
    setValue("current-min", current.minTemp);
    setValue("current-wind", current.windSpeed);
    setValue("current-precip", current.precip);
}
