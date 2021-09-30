let formEl = $('#search-form');
let searchEl = $('#citySearch');
let listEl = $('#listPrev');
const openWeatherKEY = `b182fedd8a80e5e98d46adb5bb99784e`;

const citiesArr = [`San Diego`, `Miami`, `Los Angeles`, `Orlando`, `Las Vegas`];

let openWeatherResponse = {};

const searchFromForm = (event) => {
    event.preventDefault();
    let city = searchEl.val().trim();
    addToListEl(listEl, city);
    citiesArr.unshift(city);
    event.target.reset();
    findCityWeather(city);

};

const searchFromList = (event) => {
    let city = $(event.target).data('city');
    findCityWeather(city);
};

const findCityWeather = (city) => {
    console.log(city);

    //fetch from first api lat and log

    let lon = `coord.lon`;
    let lat = `coord.lat`;

    let cityFinderURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKEY}`;
    let weatherURL = ``;

    //fetch from second api call the weather

    fetch(cityFinderURL)
        .then(response => {
            return response.json();
        })
        .then(data => {
            lon = data.coord.lon;
            lat = data.coord.lat;
            weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherKEY}`;
            return weatherURL;
        })
        .then(url => fetch(url)
            .then(response => openWeatherResponse = response)
        );

    // store api response as a global object
    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    //coord.lon City geo location, longitude
    //coord.lat City geo location, latitude
    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams ??

    //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    //pulls HTMLFormElement out of jQuery object, then resets it.

};


const addToListEl = (list, cityName) => {
    let newLiEl = $('<li>')
        .addClass('list-group-item')
        .text(cityName)
        .data(`city`, cityName);

    list.prepend(newLiEl);
};

const clearList = (list) => {
    let children = list.children();
    for (const child of children) {
        child.remove();
    }
};

const init = () => {

    clearList(listEl);

    for (const city of citiesArr) {
        addToListEl(listEl, city);
    }
};

init();
// binding event listener
formEl.submit(searchFromForm);
listEl.on('click', 'li', searchFromList);