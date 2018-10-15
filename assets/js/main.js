$(document).ready(function() {
    
    $("#enter").click(function(){
        $("#landing").hide("slow");
        $("#map-canvas").removeClass("hide");
         $("#control").removeClass("hide");
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
        ["Portloe", 50,2167, -4.8878],
        ["St Austell", 50.3277,- 4.724],
        ["Looe", 50.3485, -4.4281],
        ["Lynton",51.2380, -3.8401],
        ["Minehead", 51.2153, -3.4661]
    ];

    //set parameters for api information we need
    const params = 'swellHeight,swellDirection,swellPeriod,windDirection,windSpeed,waterTemperature,airTemperature,visibility,seaLevel';
    



    const get = (p, o) =>
        p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

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
            marker, i;


        // marker icon
        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
         

        //set markers on map
        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: { lat: locations[i][1], lng: locations[i][2] },
                map: map,
                 animation: google.maps.Animation.DROP,
                title: locations[i][0],
                icon: image
            });


            // gets relevant api data when offshore marker is clicked
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    fetch(`https://api.stormglass.io/point?lat=${locations[i][1]}&lng=${locations[i][2]}&params=${params}`, {
                        headers: {
                            //'Authorization': '9314edd6-c0d9-11e8-9f7a-0242ac130004-9314eee4-c0d9-11e8-9f7a-0242ac130004'
                            //'Authorization': '7efc5c42-c57c-11e8-9f7a-0242ac130004-7efc5d5a-c57c-11e8-9f7a-0242ac130004'
                            'Authorization': 'f1114c1a-c71c-11e8-83ef-0242ac130004-f1114d28-c71c-11e8-83ef-0242ac130004'
                        }
                        
                      


                    }).then(function(response) {
                        return response.json();
                    }).then(function(data) {
                        htmlString = '';
                        hours = data.hours;
                        console.log(hours);

                        document.getElementById("placeName").textContent = locations[i][0];
                        $("#placeName").addClass("shadow");  
                        /*function next24hours() {
                          
                            document.getElementById("next24hours").innerHTML="Next 24 Hours";
                           
                            var clickCount= 0;
                            clickCount += 24;
                            if (clickCount != 24) {
                                clickCount = clickCount - 24;
                            }
                            else if (clickCount==24){
                                clickCount = 24;
                                
                            }else{
                                
                            }*/

                            for (i = 0; i < 120; i += 6) {
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
                                 htmlString += '<td>' + (get(['seaLevel', 0, 'value'], hours[i])) + '</td>';
                                htmlString += '</tr>';
                                
                                                     
                            //   var seriesObj = { values:[(get(['swellHeight', 0, 'value'], hours[i]))]
                            //     };
                            //     var chartData = {
                            //       type: 'bar',  // Specify your chart type here.
                            //       title: {
                            //         text: 'Swell Height' // Adds a title to your chart
                            //       },
                            //       legend: {}, // Creates an interactive legend
                            //       series:[seriesObj]
                            //     };
                            //     zingchart.render({ // Render Method[3]
                            //       id: 'chartDiv',
                            //       data: chartData,
                            //       height: 400,
                            //       width: 600
                            //     });
                                                        }
                           
                            

                             $('#tideTable td').parent().empty();
                         
                           $('#tideTable').append(htmlString);
                               $('tr:nth-child(odd)').addClass('odd');
   
                            
                       
                          
                    } );
                    infoWindow.setContent(locations[i][0]);
                    infoWindow.open(map, marker);
                };
            })(marker, i));


        }



    }
   
});