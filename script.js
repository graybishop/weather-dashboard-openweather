let formEl = $('#search-form');
let searchEl = $('#citySearch');
let listEl = $('#listPrev');
const openWeatherKEY = `b182fedd8a80e5e98d46adb5bb99784e`;

const citiesArr = [`SAN DIEGO`, `MIAMI`, `LOS ANGELES`, `ORLANDO`, `LAS VEGAS`];

let openWeatherResponse = {};
let currentCitySearch = ``

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
            clearChildren(listEl)
            generateList(listEl, city);
            currentCitySearch = city
            lon = data.coord.lon;
            lat = data.coord.lat;
            weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherKEY}`;
            return weatherURL;
        })
        .then(url => fetch(url)
            .then(response => response.json())
            .then(data => updateWeatherResponse(data))
        )
        .catch(error => {
            console.log(`Ran into an issue. Probably a bad city name`, error);
        }
        );


};

const updateWeatherResponse = (weather) => {
    openWeatherResponse = weather;
    console.log(weather)
    updatePage(weather);
};

const updatePage = (w) => {

    const updateHeroCard = () => {
        let hero = $(`#hero-card`)
        let today = new Date(w.current.dt * 1000)

        hero.children().eq(0).text(`${today.getMonth()+1}/${today.getDate()} in ${currentCitySearch}`)

        let subItemsEl = hero.children().eq(1)

        let newImgEl = $('<img>')
        .attr("src", `http://openweathermap.org/img/wn/${w.current.weather[0].icon}@2x.png`)
        //Weather icon
        clearChildren(subItemsEl.children().eq(0))
        subItemsEl.children().eq(0).append(newImgEl)
        subItemsEl.children().eq(1).text(`It is currently ${w.current.temp}℉, and it feels like ${w.current.feels_like}℉`)
    }

    updateHeroCard()
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

const clearChildren = (element) => {
    let children = element.children();
    for (const child of children) {
        child.remove();
    }
};

const init = () => {
    clearChildren(listEl);
    generateList(listEl);
    findCityWeather(`ORLANDO`)
};

init();
// binding event listener
formEl.submit(searchFromForm);
listEl.on('click', 'li', searchFromList);