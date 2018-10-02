// create locations coordinates offshore close to named town to get marine information for that area.
var locations = [
    ["Penzance", 50.070092, -5.767671],
    ["St Ives", 50.250562, -5.491298],
    ["Newquay", 50.440782, -5.126195],
    ["Bude", 50.802900, -4.614876],
    ["Woolacombe", 51.166777, -4.344528]
];


//set parameters for api information we need
const params = 'waveHeight,airTemperature';

var hours;
var waves;

//initiate map
function initMap() {

    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 9,
        center: { lat: 50.738, lng: -4.002 }
    });




    // Info Window initialize
    var infoWindow = new google.maps.InfoWindow(),
        marker, i;


    // marker icon
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    //set markers on map
    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: { lat: locations[i][1], lng: locations[i][2] },
            map: map,
            title: locations[i][0],
            icon: image
        });


        // gets relevant api data when offshore marker is clicked
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                fetch(`https://api.stormglass.io/point?lat=${locations[i][1]}&lng=${locations[i][2]}&params=${params}`, {
                    headers: {
                        'Authorization': '9314edd6-c0d9-11e8-9f7a-0242ac130004-9314eee4-c0d9-11e8-9f7a-0242ac130004'
                        // 'Authorization': '7efc5c42-c57c-11e8-9f7a-0242ac130004-7efc5d5a-c57c-11e8-9f7a-0242ac130004'
                    }
                }).then(function(response) {
                    return response.json();
                }).then(function(data) {


                    // console.log(data['hours']);
                    // console.log(data.hours);
                    // console.log('First item in hours with bracket notation', data.hours[0]);
                    // console.log('first item NOAA value', data['hours'][0]['airTemperature'][3]['value']);
                    hours = data['hours'];
                    for (i = 0; i < data['hours'].length; i += 6)
                        console.log(hours[i]);
                        
                       document.getElementById("sHeight0").innerHTML = data['hours'][6]['waveHeight'][3]['value'];
                        document.getElementById("sHeight1").innerHTML = data['hours'][12]['waveHeight'][3]['value'];
                        document.getElementById("sHeight2").innerHTML = data['hours'][18]['waveHeight'][3]['value'];
                        document.getElementById("sHeight3").innerHTML = data['hours'][24]['waveHeight'][3]['value'];



                        document.getElementById("air").innerHTML = `Air Temp:` + data['hours'][6]['airTemperature'][1]['value'] + 'degrees c';

                    var clickCount = 0; // variable to store how many times the button has been clicked        

                    // Add an event listener to the button which will allow you to fire the every6Hours function
                    $('#next6hours').on('click', function() {

                        clickCount += 24;



                        document.getElementById("sHeight0").innerHTML =  data['hours'][clickCount]['waveHeight'][3]['value'];
                        document.getElementById("sHeight1").innerHTML = data['hours'][clickCount + 6]['waveHeight'][3]['value'];
                        document.getElementById("sHeight2").innerHTML = data['hours'][clickCount + 12]['waveHeight'][3]['value'];
                        document.getElementById("sHeight3").innerHTML = data['hours'][clickCount + 18]['waveHeight'][3]['value'];



                        document.getElementById("air").innerHTML = `Air Temp:` + data['hours'][clickCount]['airTemperature'][1]['value'] + 'degrees c';

                    });
                });
                infoWindow.setContent(locations[i][0]);
                infoWindow.open(map, marker);


            };


        })(marker, i));


    }

}



initMap();