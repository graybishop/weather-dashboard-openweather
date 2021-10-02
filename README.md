# weather-dashboard-openweather

## Description

A weather dashboard utilizing the OpenWeather One Call API. This web app reaches out, from the client side, to the OpenWeather One Call API and retrieves the current weather and 5-day forecast.

>'Make just one API call and get all your essential weather data for a specific location with our new OpenWeather One Call API.'
>
> [-OpenWeather One Call API Docs](https://openweathermap.org/api/one-call-api)

-OpenWeather One Cal

When they visits the page to ascertain the weather, the user can search for a city, or choose from recent searches. The data is then displayed on easy to digest cards for the user.

## Link

Link to [GitHub Pages Deployment](https://graybishop.github.io/weather-dashboard-openweather/).

## Screenshot

![screenshot of website](/images/weather-dashboard-screenshot.jpg)

## Features

### Search Bar

The first section contains a search bar. Enter a city name, or a city name and state abbreviation, then press the submit button, or press enter to begin the search.

If your city cannot be found, an error message will display.

### Previous History

Located under the search bar, the previous history list populates with your previously searched cities. On the fist visit, the list is pre-populated with city names.

### Current Weather

In the second section of the page, the current weather for your selected city is shown. This defaults to New York on the first visit.

### 5-Day Forecast

At the end of the page, the forecast of the weather for the next five days can be found, for your selected city. This defaults to New York on the first visit.

## Tech Stack

* OpenWeather One Call API
* BootStrap
* HTML5
* CSS3
* jQuery
