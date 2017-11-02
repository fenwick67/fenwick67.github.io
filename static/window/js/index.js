$(function() {
  refreshAll();
});

function refreshAll(){
  refreshImage();
  updateWeather();
}

  //refresh weather
  function updateWeather(){
  //navigator.geolocation.getCurrentPosition(function(pos) {
   // var lat = pos.coords.latitude;
   // var lon = pos.coords.longitude;
    var k = '5a4265668150c35b1544e45fee5cf3ec';

    $.get('http://api.openweathermap.org/data/2.5/weather?zip=52001&APPID='+k+'&units=imperial'
      ,function(data) {
        var temp = Math.round(data.main.temp)+' F';
        var city = data.name;
        var desc = data.weather[0].description;
        var wind = data.wind.speed + ' MPH wind';
        var iconUrl = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png'

        $('#temperature').text(temp);
        //$('#city').text(city);
        $('#description').text(desc);
        $('#wind').text(wind);

        $('#weather-icon').html('<img src="'+iconUrl+'"></img>');
      }
    );

  //})
  }


//image refresh stuff
function refreshImage(){
  var cameras = document.getElementById('cameras');
  //swap cam images
  cameras.appendChild(cameras.children[0]);
  console.log('moved it');
  //set new image
  var el = cameras.children[0];
  var url = "http://wwc.instacam.com/instacamimg/DBQHJ/DBQHJ_l.jpg?"+new Date().getTime();
  el.setAttribute('style','background-image:url("'+url+'")');
};



window.setInterval(refreshAll,120000);
window.addEventListener("activate",function(e){
  console.log('got activate');
  refreshAll();
});
