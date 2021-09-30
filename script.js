let formEl = $('#search-form');
let searchEl = $('#citySearch');
let listEl = $('#listPrev');
let forecastHolderEl = $('#forecast-holder');
const openWeatherKEY = `b182fedd8a80e5e98d46adb5bb99784e`;

const citiesArr = [`SAN DIEGO`, `MIAMI`, `LOS ANGELES`, `ORLANDO`, `LAS VEGAS`, `PORTLAND`];

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
                clearChildren(listEl)
                generateList(listEl, city);
            }
            currentCitySearch = city
            lon = data.coord.lon;
            lat = data.coord.lat;
            weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely,alerts&appid=${openWeatherKEY}`;
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

        //sets titile text
        hero.children().eq(0).text(`${today.getMonth()+1}/${today.getDate()} in ${currentCitySearch}`)

        //sub items container
        let subItemsEl = hero.children().eq(1)

        //Weather icon section
            //clears the old icon
        clearChildren(subItemsEl.children().eq(0))
            //makes new icon element
        let newImgEl = $('<img>')
        .attr("src", `http://openweathermap.org/img/wn/${w.current.weather[0].icon}@2x.png`)

        //clears placeholder text.
        subItemsEl.children().eq(0).append(newImgEl)

        //temps
        subItemsEl.children().eq(1).text(`It is currently ${w.current.temp}℉, and it feels like ${w.current.feels_like}℉.`)
        
        //wind speed
        subItemsEl.children().eq(2).text(`The wind speed is ${w.current.wind_speed}mph.`)
        
        //UV Index
        let currentUV = w.current.uvi
        let uvBGColor = ''
        let uvSpan = $('<span>').css('color', 'white').text(`${currentUV}`)

        if (currentUV >7 ){
            uvBGColor = 'red'
        } else if ( currentUV < 3){
            uvBGColor = 'green'
        } else{
            uvBGColor = 'orange'
        }
        uvSpan.css('backgroundColor', uvBGColor)
        .css('padding', '.2rem .5rem')
        .css('fontWeight', 'bold')
        subItemsEl.children().eq(3).text(`The UV index is `).append(uvSpan)
        
        //humidity
        subItemsEl.children().eq(4).text(`The humidity is ${w.current.humidity}%.`)
    }


    const renderForecastCard = (date,weather, temp, windSpeed, humidity, icon) => {
        // <div class="col-sm">
        //         <div class="card my-3 text-dark">
        //             <div class="card-body">
        //                 <h2 class="card-title text-dark">daily.dt</h2>
        //                 <div class="d-flex flex-column">
        //                     <p>daily.weather</p>
        //                     <p>daily.temp.max</p>
        //                     <p>daily.wind.speed</p>
        //                     <p>daily.humidity</p>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>

        let weatherArr =[weather, temp, windSpeed, humidity]
        
        //date string
        let today = new Date(date * 1000)
        // console.log(today)
        let dateText =`${today.getMonth()+1}/${today.getDate()}`

        //parent column
        let colEl = $('<div>').addClass('col-sm').appendTo(forecastHolderEl)
        //parent card container
        let cardEl = $('<div>').addClass(`card my-3 text-dark`).appendTo(colEl)
        //card image
        $('<img>').attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`).addClass('align-self-center').appendTo(cardEl)
        //card body
        let cardBodyEl = $('<div>').addClass(`card-body`).appendTo(cardEl)
        
        
        //card date title
        $('<h2>').addClass(`card-title text-dark`).text(dateText).appendTo(cardBodyEl)

        //container for information
        let infoEl = $('<div>').appendTo(cardBodyEl)

        for (const item of weatherArr) {
            $('<p>').text(item).appendTo(infoEl)
        }

    }

    clearChildren(forecastHolderEl)
    for (let index = 1; index < 6; index++) {
        const element = w.daily[index];
        renderForecastCard(element.dt,element.weather[0].main,`${element.temp.day}℉`,`${element.wind_speed} mph`,`${element.humidity}%`,element.weather[0].icon)
        
    }

    updateHeroCard()
};

const generateList = (list) => {

    //keeps list to 5 elements
    if (citiesArr.length > 5) {
        citiesArr.shift()
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