function nightMode() {
  var background = document.querySelector('.bg-image')
  background.style.backgroundImage = "url('src/media/night.jpg')"

  var dayButton = document.querySelector('#day-button')
  dayButton.style.background = '#7beaf3'
  dayButton.style.border = '#7beaf3'
  dayButton.style.color = '#f6a9ce'

  var nightButton = document.querySelector('#night-button')
  nightButton.style.background = '#f6a9ce'
  nightButton.style.border = '#f6a9ce'
  nightButton.style.color = 'black'
}

let nightButton = document.querySelector('#night-button')
nightButton.addEventListener('click', nightMode)

function dayMode() {
  var background = document.querySelector('.bg-image')
  background.style.backgroundImage = "url('media/day.jpg')"

  var dayButton = document.querySelector('#day-button')
  dayButton.style.background = '#f6a9ce'
  dayButton.style.border = '#f6a9ce'
  dayButton.style.color = '#7beaf3'

  var nightButton = document.querySelector('#night-button')
  nightButton.style.background = 'black'
  nightButton.style.border = 'black'
  nightButton.style.color = '#f6a9ce'
}

let dayButton = document.querySelector('#day-button')
dayButton.addEventListener('click', dayMode)

let now = new Date()

function formatDate() {
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  let currentDay = days[now.getDay()]
  let currentDate = now.getDate()
  let currentMonth = months[now.getMonth()]
  let currentYear = now.getFullYear()
  let currentHour = now.getHours()
  if (currentHour < 10) {
    currentHour = `0${currentHour}`
  }
  let currentMinutes = now.getMinutes()
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`
  }

  let h2 = document.querySelector('h2')
  h2.innerHTML = `${currentDay}, ${currentDate} ${currentMonth} ${currentYear} at ${currentHour}:${currentMinutes}`
}

formatDate()

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000)
  let day = date.getDay()
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  return days[day]
}

function showForecast(response) {
  let forecast = response.data.daily

  let forecastElement = document.querySelector('#forecast')

  let forecastHTML = `<div class="row">`

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
      
      <div class="col-2">
      <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
      <img src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png"
      alt=""
      width="42"
      />
      <div class="forecast-temp">
          <span class="forecast-high"> ${Math.round(
            forecastDay.temp.max * (9 / 5) + 32,
          )}˚ </span> / 
          <span class="forecast-low"> ${Math.round(
            forecastDay.temp.min * (9 / 5) + 32,
          )}˚ </span>
      </div>
    </div>
  `
    }
  })
  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML
}

function getForecast(coordinates) {
  console.log(coordinates)
  let apiKey = '8d4ddaa41dd589137d8ef5584615807d'
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
  axios.get(apiUrl).then(showForecast)
}

function showTemperature(response) {
  celsiusTemperature = response.data.main.temp
  celsiusHigh = response.data.main.temp_max
  celsiusLow = response.data.main.temp_min

  let temperatureElement = document.querySelector('#temperature')
  let iconElement = document.querySelector('#icon')
  let descriptionElement = document.querySelector('#current-description')
  let highElement = document.querySelector('.current-high')
  let lowElement = document.querySelector('.current-low')
  let humidityElement = document.querySelector('.current-humidity')
  let windElement = document.querySelector('.current-wind')
  let h1 = document.querySelector('h1')

  temperatureElement.innerHTML = Math.round(celsiusTemperature)
  iconElement.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
  )
  iconElement.setAttribute('alt', response.data.weather[0].description)
  descriptionElement.innerHTML = response.data.weather[0].description
  highElement.innerHTML = Math.round(celsiusHigh)
  lowElement.innerHTML = Math.round(celsiusLow)
  humidityElement.innerHTML = response.data.main.humidity
  windElement.innerHTML = Math.round(response.data.wind.speed)
  h1.innerHTML = response.data.name

  getForecast(response.data.coord)
}

function search(city) {
  let apiKey = '8d4ddaa41dd589137d8ef5584615807d'
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`

  axios.get(apiUrl).then(showTemperature)
}

function handleSubmit(event) {
  event.preventDefault()
  let cityElement = document.querySelector('#city-input')
  search(cityElement.value)
}

let citySearchForm = document.querySelector('#city-search-form')
citySearchForm.addEventListener('submit', handleSubmit)

function showPosition(position) {
  let lat = position.coords.latitude
  let lon = position.coords.longitude
  let units = 'imperial'
  let apiKey = '8d4ddaa41dd589137d8ef5584615807d'
  let apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather'
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`

  axios.get(apiUrl).then(showTemperature)
}

function showCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition)
}

let gpsSearchButton = document.querySelector('#gps-search-form')
gpsSearchButton.addEventListener('click', showCurrentPosition)

search('Charleston')
showForecast()
