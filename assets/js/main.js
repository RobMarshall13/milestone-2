// create locations coordinates offshore close to named town to get marine information for that area.
var locations = [
    ["Penzance", 50.070092, -5.767671],
    ["St Ives", 50.250562, -5.491298],
    ["Newquay", 50.440782, -5.126195],
    ["Bude", 50.802900, -4.614876],
    ["Woolacombe", 51.166777, -4.344528]
];


//set parameters for api information we need
const params = 'swellHeight,swellDirection,swellPeriod,windDirection,windSpeed,waterTemperature,airTemperature,visibility';

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
                fetch(`https://api.stormglass.io/point?lat=${locations[i][1]}&lng=${locations[i][2]}&params=${params}&source=noaa`, {
                    headers: {
                        //'Authorization': '9314edd6-c0d9-11e8-9f7a-0242ac130004-9314eee4-c0d9-11e8-9f7a-0242ac130004'
                         'Authorization': '7efc5c42-c57c-11e8-9f7a-0242ac130004-7efc5d5a-c57c-11e8-9f7a-0242ac130004'
                         //'Authorization': 'f1114c1a-c71c-11e8-83ef-0242ac130004-f1114d28-c71c-11e8-83ef-0242ac130004'
                    }
                    
                }).then(function(response) {
                     
                    return response.json();
                   
                }).then(function(data) {
                    htmlString = '';
                     hours = data['hours'];
                    for (i = 0; i < data['hours'].length; i+=12) {
                        console.log(hours[i]);
                   const get = (p, o) =>
                    p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);
                  
                        
                        htmlString += '<tr>';
                         //htmlString += '<td>'+hours,i.time+'</td>';
                         htmlString += '<td>'+(get([ 'airTemperature', 0, 'value'],hours))+'</td>';
                        //  htmlString += '<td>'+data['hours'][0]['swellHeight'][0]['value']+'</td>';
                        //  htmlString += '<td>'+data['hours'][0]['swellPeriod'][0]['value']+'</td>';
                        //  htmlString += '<td>'+data['hours'][0]['windDirection'][0]['value']+'</td>';
                        //  htmlString += '<td>'+data['hours'][0]['windSpeed'][0]['value']+'</td>';
                        //  htmlString += '<td>'+data['hours'][0]['waterTemperature'][0]['value']+'</td>';
                        //  htmlString += '<td>'+data['hours'][0]['airTemperature'][0]['value']+'</td>';
                        //  htmlString += '<td>'+data['hours'][0]['visibility'][0]['value']+'</td>';
                         htmlString += '</tr>';
                    
                    }
                    
                    $('#tideTable').append(htmlString);
                    
                
                });
                infoWindow.setContent(locations[i][0]);
                infoWindow.open(map, marker);


            };


        })(marker, i));


    }

}



initMap();


// $.each(hours, function(key,value){
//                         hours += '<tr>';
//                         hours += '<td>'+value.time+'</td>';
//                         hours += '<td>'+value.swellDirection+'</td>';
//                         hours += '<td>'+data['hours'][0]['swellHeight'][0]['value']+'</td>';
//                         hours += '<td>'+data['hours'][0]['swellPeriod'][0]['value']+'</td>';
//                         hours += '<td>'+data['hours'][0]['windDirection'][0]['value']+'</td>';
//                         hours += '<td>'+data['hours'][0]['windSpeed'][0]['value']+'</td>';
//                         hours += '<td>'+data['hours'][0]['waterTemperature'][0]['value']+'</td>';
//                         hours += '<td>'+data['hours'][0]['airTemperature'][0]['value']+'</td>';
//                         hours += '<td>'+data['hours'][0]['visibility'][0]['value']+'</td>';
//                         hours += '</tr>';
//                     });