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