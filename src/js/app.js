// Your code goes here

var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
  vinElem.innerHTML = gm.info.getVIN();
});

gm.info.getCurrentPosition(processPosition, true)

function processPosition(position){
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  console.log("Lat: " + lat);
  console.log("Long: " + lng);
}

// gm.ui.showAlert({
//   alertTitle: 'Hey Jude',
//   alertDetail: 'Don/t let me down',
//   primaryButtonText: 'I won/t!',
//   // primaryAction: function stayAndPractice() {},
//   secondaryButtonText: 'Sorry, Paul',
//   // secondaryAction: function hangWithYoko() {}
// })

/***********
BOTH DRIVER AND PASSENGER
*************/

// set windows to weather preferences
var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=Toronto&APPID=6fae7452cfc72dfb47f1dbee0ebfc635";

$.getJSON(weatherURL, function(data){
  console.log(data.weather[0].main);
  var weatherOutside = data.weather[0].main;
  if (weatherOutside == "Clouds") {
    console.log("The weather outside is " + weatherOutside);
  }
  if (weatherOutside == "Rain" || weatherOutside == "Thunderstorm") {
    console.log("The weather outside is " + weatherOutside); // suppose to print out rain
    gm.info.getVehicleData(closePassengerWindow, ['window_passenger']);
    gm.info.getVehicleData(closeDriverWindow, ['window_driver']);
    gm.info.getVehicleData(closeRearWindow, ['window_leftrear', 'window_rightrear']);

    // turn the wipers on when it rains
    gm.info.getVehicleData(wipersOn, ['wipers_on']);
  }
  if (weatherOutside == "Sunny") {
    // I am assuming that because it is sunny outside, they want their windows
    // open. AI hopefully will learn from their preferences (sometimes they like the windows open or closed)
    gm.info.getVehicleData(openPassengerWindow, ['window_passenger']);
    gm.info.getVehicleData(openDriverWindow, ['window_driver']);
    gm.info.getVehicleData(openRearRightWindow, ['window_rightrear']);
    gm.info.getVehicleData(openRearLeftWindow, ['window_leftrear']);
  }
});

/**************
DRIVER
***************/
// set left temperature
gm.info.getVehicleData(setLeftTemp, ['front_left_set_temperature', 'front_fan_speed', 'outside_air_temp']);

// only the driver is allowed to control the front fan speed. The passenger getVechicleData does not have the same arguemets

function setLeftTemp(data) {
  console.log("Outside Temp: " + data.outside_air_temp); // Outside Temp is 20
  console.log('Setting vehicle data: ', data);
  if (data.outside_air_temp > data.front_left_set_temperature) {
    // AI modeling for the temperature will be set here
    data.front_left_set_temperature = 68;
    console.log("The temperature for the left is " + data.front_left_set_temperature);
  }
  console.log("text");
  console.log(data.front_fan_speed);
  if (data.front_fan_speed == 0) {
    // ajust fan based onto settings
    console.log("The front fan speed is " + data.front_fan_speed);
  }
}

function closeDriverWindow(data) {
  // window_driver is an int. 0 is closed. Set window_passenger to 0 to close
  data.window_driver = 0;
  console.log("Windows are " + data.window_driver);
}

function openDriverWindow(data) {
  // 6 is open windows
  data.window_driver = 6;
  console.log("Windows are " + data.window_driver);
}

/************
PASSENGER
*************/
// set right temperature
gm.info.getVehicleData(setRightTemp, ['front_right_set_temperature', 'outside_air_temp']);

function setRightTemp(data) {
  console.log("Outside Temp: " + data.outside_air_temp);
  console.log('Setting vehicle data: ', data);
  if (data.front_right_set_temperature) {
    // AI modeling for the temperature will be set here
    data.front_right_set_temperature = 68;
    console.log("The temperature for the right is " + data.front_right_set_temperature);
  }
}

function closePassengerWindow(data) {
  // close the windows
  // window_passeger is an int. 0 is closed. Set window_passenger to 0 to close
  data.window_passenger = 0;
  console.log("Windows are " + data.window_passenger);
  // do ai to figure out what user preferences are during certain weather patterns
}

function openPassengerWindow(data) {
  // open the windows on a good day
  console.log("Windows are " + data.window_passenger);
  // window_passenger is an int. 6 is fully open. Set window_passenger to 5 to close
  data.window_passenger = 6;

  // do ai to figure out what user preferences are during certain weather patterns
}

/**************
REAR PASSENGERS
**************/
function closeRearWindow(data) {
  // 0 is closed. Because it's raining, you obviously want it closed
  data.window_leftrear = 0;
  data.window_rightrear = 0;
}

function  openRearRightWindow(data) {
  // 6 is open. More AI to learn what the user actually wants ("Does the person want windows partially open...?")
  data.window_rightrear = 6;
}

function openRearLeftWindow(data) {
  // 6 is open. More AI to learn what the user actually wants
  data.window_leftrear = 6;
}

function wipersOn(data) {
  data.wipers_on = 1;
  console.log("Wipers are on");
}

// gm.voice.startTTS(success, 'Keep your eyes on the road, your hands up on the wheel');
//
// function success() {
//   // let it roll
//   if (gm.voice && gm.voice.startTTS) {
//     console.log("rain");
//   }
//   // console.log("Rain beginning");
// }

/*********
Google maps api
**********/

function initMap() {
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var uluru = {lat: 43.6577971, lng: -79.38109829999996};
  var destination = {lat: 43.6558227, lng: -79.38196419999997};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: uluru
  });
  directionsDisplay.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsDisplay);
  var contentString = '<div id="content">' +
                      '<div id="siteNotice"></div>' +
                      '<h1 id ="store" class="firstHeading">Best Buy Has Deals</h1>' +
                      '<img align="Left" src="images/best-buy-deal-1.png">' +
                      '</div>'
                      '</div>';
  var infoWindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 200,
    maxHeight: 1000
    // content: '<img align="Left" src="images/best-buy-deals.jpg" width=50 height=50>'
  });

  var marker = new google.maps.Marker({
    position: destination,
    map: map,
    title: 'Best Buy Sales'
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: {lat: 43.6577971, lng: -79.38109829999996},
    destination: {lat: 43.6558227, lng: -79.38196419999997},
    travelMode: google.maps.TravelMode["DRIVING"]
  }, function(response, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      conosle.log('Directions request failed due to ' + status);
    }
  });
}
