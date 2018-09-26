

    var locations = [
        ["Penzance", 50.070092, -5.767671],
        ["St Ives", 50.250562, -5.491298],
        ["Newquay", 50.440782, -5.126195],
        ["Bude", 50.802900, -4.614876],
        ["Woolacombe", 51.166777, -4.344528]
    ];


    //var lat = locations[1];
    //var lng = locations[2];
    const params = 'waveHeight,airTemperature';





    function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: { lat: 50.652433, lng: -4.142118 }
        });




        // Info Window Content

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



            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    fetch(`https://api.stormglass.io/point?lat=${locations[i][1]}&lng=${locations[i][2]}&params=${params}`, {
                        headers: {
                            'Authorization': '9314edd6-c0d9-11e8-9f7a-0242ac130004-9314eee4-c0d9-11e8-9f7a-0242ac130004'
                        }
                    }).then(function(response) {
                        return response.json();
                    }).then(function(data) {
                        console.log(data);
                    });
                    infoWindow.setContent(locations[i][0]);
                    infoWindow.open(map, marker);
                };


            })(marker, i));


        }
    }

    initMap();
