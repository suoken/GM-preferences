// Your code goes here

var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
  vinElem.innerHTML = gm.info.getVIN();
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

// set windows to weather preferences
// gm.info.getVehicleData(setPassengerWindow, ['window_passenger']);
var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=Toronto&APPID=6fae7452cfc72dfb47f1dbee0ebfc635";

$.getJSON(weatherURL, function(data){
  console.log(data.weather[0].main);
  var weatherOutside = data.weather[0].main;
  if (weatherOutside == "Clouds") {
    console.log("The weather outside is " + weatherOutside);
  }
  if (weatherOutside == "Rain") {
    console.log("The weather outside is " + weatherOutside); // suppose to print out rain
    // roooooooollll the windows upppp
    gm.info.getVehicleData(closePassengerWindow, ['window_passenger']);
  }
  if (weatherOutside == "Sunny") {
    gm.info.getVehicleData(openPassengerWindow, ['window_passenger']);
  }
});

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
