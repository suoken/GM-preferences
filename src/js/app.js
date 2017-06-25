// Your code goes here

var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
  vinElem.innerHTML = gm.info.getVIN();
});

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
  if (weatherOutside == "Rain") {
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
  console.log("Windows are " + data.window_passenger);
  // window_passeger is an int. 0 is closed. Set window_passenger to 0 to close
  data.window_passenger = 0;
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
