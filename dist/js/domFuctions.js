export const setPlaceholderText = () => {
    const input = document.getElementById("searchBar__text");
    window.innerWidth < 400
      ? (input.placeholder = "City, State, Country")
      : (input.placeholder = "City, State, Country, or Zip Code");
  };
  
  export const addSpinner = (element) => {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
  };
  
  const animateButton = (element) => {
    element.classList.toggle("none");
    element.nextElementSibling.classList.toggle("block");
    element.nextElementSibling.classList.toggle("none");
  };
  
  export const displayError = (headerMsg, srMsg) => {
    updateWeatherLocationHeader(headerMsg);
    updateScreenReaderConfirmation(srMsg);
  };
  
  export const displayApiError = (statusCode) => {
    const properMsg = toProperCase(statusCode.message);
    updateWeatherLocationHeader(properMsg);
    updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
  };
  
  const toProperCase = (text) => {
    const words = text.split(" ");
    const properWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return properWords.join(" ");
  };
  
  const updateWeatherLocationHeader = (message) => {
    const h2 = document.getElementById("currentForecast__location");
    if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
      const msgArray = message.split(" ");
      const mapArray = msgArray.map((msg) => {
        return msg.replace(":", ": ");
      });
      const lat =
        mapArray[0].indexOf("-") === -1
          ? mapArray[0].slice(0, 10)
          : mapArray[0].slice(0, 11);
      const lon =
        mapArray[1].indexOf("-") === -1
          ? mapArray[1].slice(0, 11)
          : mapArray[1].slice(0, 12);
      h2.textContent = `${lat} • ${lon}`;
    } else {
      h2.textContent = message;
    }
  };
  
  export const updateScreenReaderConfirmation = (message) => {
    document.getElementById("confirmation").textContent = message;
  };
  
  export const updateDisplay = (weatherJson, locationObj) => {
    fadeDisplay();
    clearDisplay();
    const weatherClass = getWeatherClass(weatherJson.list[0].weather[0].icon);
    setBGImage(weatherClass);
    updateWeatherLocationHeader(locationObj.getName());
    const ccArray = createCurrentConditionsDivs(
      weatherJson
    );
    displayCurrentConditions(ccArray);
   displayFiveDayForecast(weatherJson);
    setFocusOnSearch();
    fadeDisplay();
  };
  
  const fadeDisplay = () => {
    const cc = document.getElementById("currentForecast");
    cc.classList.toggle("zero-vis");
    cc.classList.toggle("fade-in");
    const sixDay = document.getElementById("dailyForecast");
    sixDay.classList.toggle("zero-vis");
    sixDay.classList.toggle("fade-in");
  };
  
  const clearDisplay = () => {
    const currentConditions = document.getElementById(
      "currentForecast__conditions"
    );
    deleteContents(currentConditions);
    const sixDayForecast = document.getElementById("dailyForecast__contents");
    deleteContents(sixDayForecast);
  };
  
  const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
  };
  
  const getWeatherClass = (icon) => {
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    const weatherLookup = {
      "09": "snow",
      10: "rain",
      11: "rain",
      13: "snow",
      50: "fog"
    };
    let weatherClass;
    if (weatherLookup[firstTwoChars]) {
      weatherClass = weatherLookup[firstTwoChars];
    } else if (lastChar === "d") {
      weatherClass = "clouds";
    } else {
      weatherClass = "night";
    }
    return weatherClass;
  };
  
  const setBGImage = (weatherClass) => {
    document.documentElement.classList.add(weatherClass);
    document.documentElement.classList.forEach((img) => {
      if (img !== weatherClass) document.documentElement.classList.remove(img);
    });
  };
  
  const setFocusOnSearch = () => {
    document.getElementById("searchBar__text").focus();
  };
  
  const createCurrentConditionsDivs = (weatherObj) => {
        const icon = createMainImgDiv(weatherObj.list[0].weather[0].icon, weatherObj.list[0].weather[0].description);
        const temp = createElem("div", "temp", `${Math.round(Number(weatherObj.list[0].main.temp)- 273)}°`);
        const properDesc = toProperCase(weatherObj.list[0].weather[0].description);
        const desc = createElem("div", "desc", properDesc);
        const feels = createElem("div", "feels", `Feels Like ${Math.round(Number(weatherObj.list[0].main.feels_like) - 273)}°`);
        const maxTemp = createElem("div", "maxtemp", `High ${Math.round(Number(weatherObj.list[0].main.temp_max)- 273)}°`);
        const minTemp = createElem("div", "mintemp", `Low ${Math.round(Number(weatherObj.list[0].main.temp_min) - 273)}°`);
        const humidity = createElem("div", "humidity", `Humidity ${Math.round(Number(weatherObj.list[0].main.humidity))}%`);
        const wind = createElem("div", "wind", `Wind ${Math.round(Number(weatherObj.list[0].wind.speed))}`);
        return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
  };
  
  const createMainImgDiv = (icon, altText) => {
    const iconDiv = createElem("div", "icon");
    iconDiv.id = "icon";
    const faIcon = translateIconToFontAwesome(icon);
    faIcon.ariaHidden = true;
    faIcon.title = altText;
    iconDiv.appendChild(faIcon);
    return iconDiv;
  };
  
  const createElem = (elemType, divClassName, divText, unit) => {
    const div = document.createElement(elemType);
    div.className = divClassName;
    if (divText) {
      div.textContent = divText;
    }
    if (divClassName === "temp") {
      const unitDiv = document.createElement("div");
      unitDiv.className = "unit";
      unitDiv.textContent = unit;
      div.appendChild(unitDiv);
    }
    return div;
  };
  
  const translateIconToFontAwesome = (icon) => {
    const i = document.createElement("i");
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    switch (firstTwoChars) {
      case "01":
        if (lastChar === "d") {
          i.classList.add("far", "fa-sun");
        } else {
          i.classList.add("far", "fa-moon");
        }
        break;
      case "02":
        if (lastChar === "d") {
          i.classList.add("fas", "fa-cloud-sun");
        } else {
          i.classList.add("fas", "fa-cloud-moon");
        }
        break;
      case "03":
        i.classList.add("fas", "fa-cloud");
        break;
      case "04":
        i.classList.add("fas", "fa-cloud-meatball");
        break;
      case "09":
        i.classList.add("fas", "fa-cloud-rain");
        break;
      case "10":
        if (lastChar === "d") {
          i.classList.add("fas", "fa-cloud-sun-rain");
        } else {
          i.classList.add("fas", "fa-cloud-moon-rain");
        }
        break;
      case "11":
        i.classList.add("fas", "fa-poo-storm");
        break;
      case "13":
        i.classList.add("far", "fa-snowflake");
        break;
      case "50":
        i.classList.add("fas", "fa-smog");
        break;
      default:
        i.classList.add("far", "fa-question-circle");
    }
    return i;
  };
  
  const displayCurrentConditions = (currentConditionsArray) => {
    const ccContainer = document.getElementById("currentForecast__conditions");
    currentConditionsArray.forEach((cc) => {
      ccContainer.appendChild(cc);
    });
  };
  
  const displayFiveDayForecast = (weatherJson) => {
    for (let i = 7; i <= 39; i+=8) {
      const dfArray = createDailyForecastDivs(weatherJson.list[i]);
      displayDailyForecast(dfArray);
    }
  };
  
  const createDailyForecastDivs = (dayWeather) => {
    const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
    const dayAbbreviation = createElem(
      "p",
      "dayAbbreviation",
      dayAbbreviationText
    );
    const dayIcon = createDailyForecastIcon(
      dayWeather.weather[0].icon,
      dayWeather.weather[0].description
    );
    const dayHigh = createElem(
      "p",
      "dayHigh",
      `${Math.round(Number(dayWeather.main.temp_max)- 273)}°`
    );
    const dayLow = createElem(
      "p",
      "dayLow",
      `${Math.round(Number(dayWeather.main.temp_min)- 277)}°`
    );
    return [dayAbbreviation, dayIcon, dayHigh, dayLow];
  };
  
  const getDayAbbreviation = (data) => {
    const dateObj = new Date(data * 1000);
    const utcString = dateObj.toUTCString();
    return utcString.slice(0, 3).toUpperCase();
  };
  
  const createDailyForecastIcon = (icon, altText) => {
    const img = document.createElement("img");
    if (window.innerWidth < 768 || window.innerHeight < 1025) {
      img.src = `https://openweathermap.org/img/wn/${icon}.png`;
    } else {
      img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }
    img.alt = altText;
    return img;
  };
  
  const displayDailyForecast = (dfArray) => {
    const dayDiv = createElem("div", "forecastDay");
    dfArray.forEach((el) => {
      dayDiv.appendChild(el);
    });
    const dailyForecastContainer = document.getElementById(
      "dailyForecast__contents"
    );
    dailyForecastContainer.appendChild(dayDiv);
  };