let formEl = $('#search-form');
let searchEl = $('#citySearch');
let listEl = $('#listPrev');
let forecastHolderEl = $('#forecast-holder');
const openWeatherKEY = `b182fedd8a80e5e98d46adb5bb99784e`;

//starting city list for new instances
let citiesArr = [`SAN DIEGO`, `MIAMI`, `LOS ANGELES`, `ORLANDO`, `LAS VEGAS`, `PORTLAND`, `NEW YORK`];

let openWeatherResponse = {};
let currentCitySearch = ``

//triggered when user submits a city name 
const searchFromForm = (event) => {
    event.preventDefault();
    let city = searchEl.val().trim().toUpperCase();
    event.target.reset();
    findCityWeather(city);

};

//triggered when user clicks on city in list. 
const searchFromList = (event) => {
    let city = $(event.target).data('city');
    findCityWeather(city);
};

//finds city coords then passes them to weather API for data. 
const findCityWeather = (city) => {
    //fetch from first api lat and log
    hideError()
    renderPlaceHolders()
    let lat = `coord.lat`;
    let lon = `coord.lon`;
    let cityFinderURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKEY}`;
    let weatherURL = ``;

    //fetch from second api call the weather


    fetch(cityFinderURL)
        .then(response => {
            if (!response.ok) {
                showError()
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
                storeData(citiesArr)
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
        //stops chain if the city is not found/ bad api request
        .catch(error => {
            console.log(`Ran into an issue. Probably a bad city name`, error);
        }
        );


};

const updateWeatherResponse = (weather) => {
    openWeatherResponse = weather;
    console.log(weather)
    setTimeout(() => {
        updatePage(weather)
    }, 100);;
};

const showError = () => {
    $('#error').show('fast')
}
const hideError = () => {
    $('#error').hide()
}


const renderPlaceHolders = () => {
    let hero = $(`#hero-card`)
    
    const updateHeroCard = () => {
        //sets title text
        hero.children().eq(0).html(`<span class="placeholder col-9"></span>`).addClass(`placeholder-glow`)

        //sub items container
        let subItemsEl = hero.children().eq(1)

        //Weather icon section
            //clears the old icon
        clearChildren(subItemsEl.children().eq(0))
            //makes new icon element
        let newImgEl = $('<img>')
        .attr("src", `http://openweathermap.org/img/wn/01d@2x.png`)

        //clears placeholder text.
        subItemsEl.children().eq(0).append(newImgEl)

        //temps
        subItemsEl.children().eq(1).html(`<span class="placeholder col-8"></span>`).addClass(`placeholder-glow`)
        
        //wind speed
        subItemsEl.children().eq(2).html(`<span class="placeholder col-9"></span>`).addClass(`placeholder-glow`)
        
        subItemsEl.children().eq(3).html(`<span class="placeholder col-6"></span>`).addClass(`placeholder-glow`)
        
        //humidity
        subItemsEl.children().eq(4).html(`<span class="placeholder col-12"></span>`).addClass(`placeholder-glow`)
    }

    const renderForecastCard = () => {

        //parent column
        let colEl = $('<div>').addClass('col-sm').appendTo(forecastHolderEl)
        //parent card container
        let cardEl = $('<div>').addClass(`card mb-3 text-dark align-items-center h-100`).appendTo(colEl)
        //card image
        $('<img>').attr("src", `http://openweathermap.org/img/wn/01d@2x.png`).addClass('align-self-center').appendTo(cardEl)
        //card body
        let cardBodyEl = $('<div>').addClass(`card-body w-100`).appendTo(cardEl)
        
        //card date title
        $('<h3>').addClass(`card-title text-dark placeholder-glow`).html(`<span class="placeholder col-12"></span>`).appendTo(cardBodyEl)

        //container for information
        let infoEl = $('<div>').appendTo(cardBodyEl).addClass('w-100')

        for (let index = 0; index < 5; index++) {
            $('<p>').html(`<span class="placeholder col-12"></span>`).addClass('placeholder-glow').appendTo(infoEl)
        }

    }

    clearChildren(forecastHolderEl)

    for (let index = 0; index < 5; index++) {
        const element = index;
        renderForecastCard()
    }



    updateHeroCard()
}

//updates page elements
const updatePage = (w) => {
    //updates hero card when fed weather data
    const updateHeroCard = () => {
        let hero = $(`#hero-card`)
        let today = new Date(w.current.dt * 1000)

        //sets title text
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

    //renders a forecast card when fed weather data.
    const renderForecastCard = (date,weather, temp, windSpeed, humidity, icon) => {
        let weatherArr =[weather, temp, windSpeed, humidity]
        
        //date string
        let today = new Date(date * 1000)
        // console.log(today)
        let dateText =`${today.getMonth()+1}/${today.getDate()}`

        //parent column
        let colEl = $('<div>').addClass('col-sm').appendTo(forecastHolderEl)
        //parent card container
        let cardEl = $('<div>').addClass(`card mb-3 text-dark align-items-center h-100`).appendTo(colEl)
        //card image
        $('<img>').attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`).addClass('align-self-center').appendTo(cardEl)
        //card body
        let cardBodyEl = $('<div>').addClass(`card-body`).appendTo(cardEl)
        
        
        //card date title
        $('<h3>').addClass(`card-title text-dark`).text(dateText).appendTo(cardBodyEl)

        //container for information
        let infoEl = $('<div>').appendTo(cardBodyEl)

        for (const item of weatherArr) {
            $('<p>').text(item).appendTo(infoEl)
        }

    }

    //start processing here.
    //clear forecast cards and recreate them.
    clearChildren(forecastHolderEl)
    for (let index = 1; index < 6; index++) {
        const element = w.daily[index];
        renderForecastCard(
            element.dt,
            `Weather: ${element.weather[0].main}`,
            `Temperature: ${element.temp.day}℉`,
            `Wind speed: ${element.wind_speed} mph`,
            `Humidity: ${element.humidity}%`,
            element.weather[0].icon)
        
    }

    updateHeroCard()
};

//generates recent searches list
const generateList = (list) => {
    //keeps list to 6 elements
    if (citiesArr.length > 7) {
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

//helper function to clear children of given element
const clearChildren = (element) => {
    let children = element.children();
    for (const child of children) {
        child.remove();
    }
};

const init = () => {
    renderPlaceHolders()
    retrieveData()
    clearChildren(listEl);
    generateList(listEl);
    findCityWeather(citiesArr[citiesArr.length-1])
};

const retrieveData = () => {
    let localData = window.localStorage.getItem(`recentCities`)

    
    if (localData) {
        console.log('Local data found.')
        citiesArr = JSON.parse(localData)
    } else{
        console.log('Local not found. Using default list.')
        storeData(citiesArr)
        
    }
}

const storeData = (arr) => {
    localStorage.setItem(`recentCities`, JSON.stringify(arr))
}

init();
// binding event listener
formEl.submit(searchFromForm);
listEl.on('click', 'li', searchFromList);
// listEl.on('click', 'li', renderPlaceHolders);