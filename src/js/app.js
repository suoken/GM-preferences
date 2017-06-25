// Your code goes here

var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
  vinElem.innerHTML = gm.info.getVIN();
});

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

