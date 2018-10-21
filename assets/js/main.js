$(document).ready(function() {

    $("#enter").click(function() {
        $("#landing").hide("slow");
        $("#map-canvas").removeClass("hide");
        $("#control").removeClass("hide");
        $(".navbar").removeClass("hide")
       
        initMap();
    });




    // create locations coordinates offshore close to named town to get marine information for that area.
    var locations = [
        ["Sennen", 50.070092, -5.767671],
        ["St Ives", 50.220352, -5.482625],
        ["Perranporth", 50.3437, -5.1731],
        ["Newquay (Fistral)", 50.4172, -5.1013],
        ["Mawgan Porth", 50.4617, -5.0449],
        ["Tintagel", 50.6734, -4.756],
        ["Widemouth Bay", 50.7874, -4.5617],
        ["Bude (Summerleaze)", 50.8349, -4.5584],
        ["Westward Ho", 51.0545, -4.2390],
        ["Porthleven", 50.0754, -5.3375],
        ["Lizard", 49.951, -5.206],
        ["Falmouth", 50.137, -5.030],
        ["Portloe", 50, 2167, -4.8878],
        ["St Austell", 50.3277, -4.724],
        ["Looe", 50.3485, -4.4281],
        ["Lynton", 51.2380, -3.8401],
        ["Minehead", 51.2153, -3.4661]
    ];

    //set parameters for api information we need
    const params = 'swellHeight,swellDirection,swellPeriod,windDirection,windSpeed,waterTemperature,airTemperature,visibility,seaLevel';

    var hours;
    var htmlString;
   


    //initiate map
    function initMap() {
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 8,
            center: { lat: 50.738, lng: -4.002 },
            mapTypeId: 'hybrid'

        });

        // Info Window initialize
        var infoWindow = new google.maps.InfoWindow(),
            flag, i;


        // marker icon
        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';


        //set markers on map
        for (i = 0; i < locations.length; i++) {
            flag = new google.maps.Marker({
                position: { lat: locations[i][1], lng: locations[i][2] },
                map: map,
                animation: google.maps.Animation.DROP,
                title: locations[i][0],
                icon: image
            });


            // gets relevant api data when offshore marker is clicked
            google.maps.event.addListener(flag, 'click', (function(flag, i) {
                return function() {
                    fetch(`https://api.stormglass.io/point?lat=${locations[i][1]}&lng=${locations[i][2]}&params=${params}`, {
                        headers: {
                            'Authorization': '9314edd6-c0d9-11e8-9f7a-0242ac130004-9314eee4-c0d9-11e8-9f7a-0242ac130004'
                            //'Authorization': '7efc5c42-c57c-11e8-9f7a-0242ac130004-7efc5d5a-c57c-11e8-9f7a-0242ac130004'
                            //'Authorization': 'f1114c1a-c71c-11e8-83ef-0242ac130004-f1114d28-c71c-11e8-83ef-0242ac130004'
                        }




                    }).then(function(response) {
                        return response.json();
                    }).then(function(data) {
                        htmlString = '';
                        hours = data.hours;
                        console.log(hours);

                        document.getElementById("placeName").textContent = locations[i][0];
                        $("#placeName").addClass("shadow");
                        
                        var swellDirections = {};
                        var windDirections = {};
                        
                        for (i = 0; i < 120; i += 6) {

                            console.log(hours[i]);
                            var DateStamp = new Date(hours[i].time);
                            var timeStamp = new Date(hours[i].time);
                            var convertedDate = DateStamp.toLocaleDateString();
                            var convertedTime = timeStamp.toLocaleTimeString();
                         
                          
                             
                             
                            
                            var swellDirection = hours[i].swellDirection[2].value;
                            
                            var swellHeight = hours[i].swellHeight[2].value;
                            var visibility = hours[i]['visibility'][0].value;
                            var waterTemperature = hours[i].waterTemperature[2].value;
                            var windDirection = hours[i].windDirection[2].value;
                            var windSpeed = hours[i].windSpeed[2].value;
                            var airTemperature = hours[i].airTemperature[2].value;
                            var swellPeriod = hours[i].swellPeriod[2].value;
                            var seaLevel = hours[i].seaLevel[0].value;
                            
                            var imgId = "arrImage" + i.toString();
                            swellDirections[imgId] = swellDirection;
                            
                             var imgIdwind = "windArrImage" + i.toString();
                            windDirections[imgIdwind] = windDirection;
                            
                          
                           

                            htmlString += '<tr>';
                            htmlString += '<td>' + convertedDate + '<br></br>' + convertedTime + '</td>';
                            htmlString += '<td>' + '<img src="assets/images/if_Forward-64_32079.1.png"'+' id="' + imgId + '">' + '</td>';
                            htmlString += '<td>' + swellHeight + '</td>';
                            htmlString += '<td>' + swellPeriod + '</td>';
                            htmlString += '<td>' + '<img src="assets/images/if_Forward-64_32079.1.png"'+' id="' + imgIdwind + '">' + '</td>';
                            htmlString += '<td>' + windSpeed + '</td>';
                            htmlString += '<td>' + waterTemperature + '</td>';
                            htmlString += '<td>' + airTemperature + '</td>';
                            htmlString += '<td>' + visibility + '</td>';
                            htmlString += '<td>' + seaLevel + '</td>';
                            htmlString += '</tr>';
                            
                            
                          
                            
                        }


 
                              
                         
                        $('#tideTable td').parent().remove();
                        $('#tideTable').append(htmlString);
                        $('tr:nth-child(odd)').addClass('odd');
                        
                        for(var image in swellDirections) {
                            $("#" + image).css({
                              '-webkit-transform' : 'rotate(' + swellDirections[image] + 'deg)',
                              '-moz-transform'    : 'rotate(' + swellDirections[image] + 'deg)',
                              '-ms-transform'     : 'rotate(' + swellDirections[image] + 'deg)',
                              '-o-transform'      : 'rotate(' + swellDirections[image] + 'deg)',
                              'transform'         : 'rotate(' + swellDirections[image] + 'deg)'
                            });
                        }
                        
                        for(var image in windDirections) {
                            $("#" + image).css({
                               
                              '-webkit-transform' : 'rotate(' + windDirections[image] + 'deg)',
                              '-moz-transform'    : 'rotate(' + windDirections[image] + 'deg)',
                              '-ms-transform'     : 'rotate(' + windDirections[image] + 'deg)',
                              '-o-transform'      : 'rotate(' + windDirections[image] + 'deg)',
                              'transform'         : 'rotate(' + windDirections[image] + 'deg)'
                            });
                        }

                    });
                    infoWindow.setContent(locations[i][0]);
                    infoWindow.open(map, flag);
                };
                
                
                
              
               
                
            })(flag, i));
        }
      
   
    
 }
    initMap();
 
 
});