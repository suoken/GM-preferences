// Your code goes here

var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
  vinElem.innerHTML = gm.info.getVIN();
});

var skip = document.getElementById('skip');
var welcome = document.getElementById('welcome');
var second = document.getElementById('secondary');
skip.addEventListener('click', function(){
   welcome.classList.add('hide');
   second.classList.remove('hide');
});

gm.info.getCurrentPosition(processPosition, true)

function processPosition(position){
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  console.log("Lat: " + lat);
  console.log("Long: " + lng);
}

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
  // if (data.outside_air_temp > data.front_left_set_temperature) {
    // AI modeling for the temperature will be set here
  data.front_left_set_temperature = 22;
  var airTempLeft = document.getElementById("air-temp-left-status");
  airTempLeft.innerHTML = "Passenger air temp set to " + data.front_left_set_temperature + " &#8451";

  console.log("The temperature for the left is " + data.front_left_set_temperature);
  // }
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
  // if (data.front_right_set_temperature) {
    // AI modeling for the temperature will be set here
    data.front_right_set_temperature = 18;
    var airTempRight = document.getElementById("air-temp-right-status");
    airTempRight.innerHTML = "Passenger air temp set to " + data.front_right_set_temperature + " &#8451";
    console.log("The temperature for the right is " + data.front_right_set_temperature);
  // }
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
  var windowStatus = document.getElementById("window-status");
  windowStatus.innerHTML = "Rain is forcasted. All windows are closed. <br/> "

}

function  openRearRightWindow(data) {
  // 6 is open. More AI to learn what the user actually wants ("Does the person want windows partially open...?")
  data.window_rightrear = 6;
  var windowStatus = document.getElementById("window-status");
  windowStatus.innerHTML = "Sunny Days. Windows are open. <br/> "
}

function openRearLeftWindow(data) {
  // 6 is open. More AI to learn what the user actually wants
  data.window_leftrear = 6;
  var windowStatus = document.getElementById("window-status");
  windowStatus.innerHTML = "Sunny Days. Windows are open. <br/> "
}

function wipersOn(data) {
  data.wipers_on = 1;
  console.log("Wipers are on");
  var wiperStatus = document.getElementById("wiper-status");
  wiperStatus.innerHTML = "Wipers are on.";

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

var temperatureArray = [[15,28],[14,26],[16,29],[12,25]]
var convertedData = 0;
var count = 0;
var time;
var destinationArray =[[87.4,92.4],[88.2,95.1],[90.3,94.5]] //[lat,lon]

function showSpeed(data){

	var speed = data.average_speed;
	if(speed != undefined){

		var speedText = document.getElementById('speed');
		speedText.innerHTML = speed
	}
}
function getTemperature(data) {
	convertedData = (data.outside_air_temp)

}


function setTemperature(data){

	var temperature = convert(data.front_left_set_temperature);
	var tempArray = [temperature , convertedData]
	temperatureArray.push(tempArray)
	console.log(temperatureArray)
	var temperatureText = document.getElementById('temperature');
	temperatureText.innerHTML = temperature
	count++;

}

function autoTemp(data) {

	var outsideTestTemperature = convertedData;
	var f = regression('linear', temperatureArray)
	var slope = f.equation[0]
	var yIntercept = f.equation[1]
	var insideTemperature = (outsideTestTemperature - yIntercept)/slope

	console.log("Outside temperature: " + outsideTestTemperature)
	console.log("Predicted inside temperature: " + insideTemperature)
	data.front_left_set_temperature = insideTemperature


}

function get_destination(data) {
	console.log(data.address)

	gm.info.getCurrentPosition(timeOfDay)
	var tempArray = [data.coords.latitude, data.coords.longitude]
	destinationArray.push(tempArray);

}

function set_destination(data){

console.log("destination has been set at " + data)

}

function timeOfDay(data) {
	console.log(data)
	time = data.timestamp;

}


function convert(dataTemp){

	if (typeof(dataTemp) == "string"){
		//console.log(temp.hexa[dataTemp]);
		return temp.hexa[dataTemp];
	} else {

		//console.log(temp.num[dataTemp]);
		return temp.num[dataTemp];
	}
}

gm.info.getVehicleData(showSpeed,['average_speed']);

gm.info.watchVehicleData(showSpeed,['average_speed']);

if(count < 20){
	gm.info.getVehicleData(getTemperature,['outside_air_temp']);
	gm.info.getVehicleData(setTemperature,['front_left_set_temperature']);
}

else{

	gm.info.getVehicleData(getTemperature,['outside_air_temp']);
	gm.info.getVehicleData(autoTemp,['front_left_set_temperature']);
}

gm.nav.getDestination(get_destination)

// algo - Kmeans clustering to figure out concentration of places

gm.nav.setDestination(set_destination, dest)



//weather outside, temperature inside, mirror, seating, traffic by accident,
