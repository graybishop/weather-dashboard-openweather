let formEl = $('#search-form');
let searchEl = $('#citySearch');
let listEl = $('#listPrev');
const openWeatherKEY = `b182fedd8a80e5e98d46adb5bb99784e`;

const citiesArr = [`SAN DIEGO`, `MIAMI`, `LOS ANGELES`, `ORLANDO`, `LAS VEGAS`];

let openWeatherResponse = {};

const searchFromForm = (event) => {
    event.preventDefault();
    let city = searchEl.val().trim().toUpperCase();
    event.target.reset();
    findCityWeather(city);

};

const searchFromList = (event) => {
    let city = $(event.target).data('city');
    findCityWeather(city);
};

const findCityWeather = (city) => {
    //fetch from first api lat and log
    let lat = `coord.lat`;
    let lon = `coord.lon`;
    let cityFinderURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKEY}`;
    let weatherURL = ``;

    //fetch from second api call the weather


    fetch(cityFinderURL)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            //if city is found, add to list and object, if not duplicate
            if(!citiesArr.includes(city)){
                citiesArr.push(city);
            }
            clearList(listEl)
            generateList(listEl, city);
            
            lon = data.coord.lon;
            lat = data.coord.lat;
            weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherKEY}`;
            return weatherURL;
        })
        .then(url => fetch(url)
            .then(response => updateWeatherResponse(response))
        )
        .catch(error => {
            console.log(`Ran into an issue. Probably a bad city name`, error);
        }
        );


};

const updateWeatherResponse = (weather) => {
    openWeatherResponse = weather;
    updatePage();
};

const updatePage = () => {

};

const generateList = (list) => {

    //keeps the list to 7 or fewer elements.
    if (list.children().length > 6) {
        list.children().last().remove();
        citiesArr.pop()
    }

    for (const city of citiesArr) {
        let newLiEl = $('<li>')
        .addClass('list-group-item')
        .text(city)
        .data(`city`, city);

        list.prepend(newLiEl);
    }
    
};

const clearList = (list) => {
    let children = list.children();
    for (const child of children) {
        child.remove();
    }
};

const init = () => {
    clearList(listEl);
    generateList(listEl);
    
};

init();
// binding event listener
formEl.submit(searchFromForm);
listEl.on('click', 'li', searchFromList);