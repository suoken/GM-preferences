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
