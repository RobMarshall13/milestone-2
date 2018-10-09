$(document).ready(function() {

    var d = new Date();
    var getInfo;
    console.log(d);

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
    var clickCount = 24;
    $("#next24hours").click(function() {
        clickCount += 24;
        
    });


    const get = (p, o) =>
        p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

    var hours;
    var htmlString;

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
                                //'Authorization': '7efc5c42-c57c-11e8-9f7a-0242ac130004-7efc5d5a-c57c-11e8-9f7a-0242ac130004'
                                'Authorization': 'f1114c1a-c71c-11e8-83ef-0242ac130004-f1114d28-c71c-11e8-83ef-0242ac130004'
                            }
                        }).then(function(response) {
                            return response.json();
                        }).then(function(data) {
                            htmlString = '';
                            hours = data['hours'];
                            console.log(hours);
                            for (i = 0; i < clickCount; i += 6) {
                                console.log(hours[i]);

                                var timeStamp = hours[i].time.slice(0, 16);



                                htmlString += '<tr>';
                                htmlString += '<td>' + timeStamp + '</td>';
                                htmlString += '<td>' + (get(['swellDirection', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '<td>' + (get(['swellHeight', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '<td>' + (get(['swellPeriod', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '<td>' + (get(['windDirection', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '<td>' + (get(['windSpeed', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '<td>' + (get(['waterTemperature', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '<td>' + (get(['airTemperature', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '<td>' + (get(['visibility', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '</tr>';
                            }
                            $('#tideTable td').parent().empty();




                            $('#tideTable').append(htmlString);

                        });
                        infoWindow.setContent(locations[i][0]);
                        infoWindow.open(map, marker);
                    };
                })(marker, i));
                
        
        }

     

    }
     initMap();  
});