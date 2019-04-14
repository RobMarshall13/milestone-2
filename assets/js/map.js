

function initialize() {
    var markers = [];
    var locations = [];
      // set global variables for use later 
    var hours;
    var htmlString;
   
   
    var marker, i;
    var iconSrc = {}; 
    
    var count = -1;//counter for click function that get marine info
    var counter = -1;// counter for function that gets weather info
    var lat = [];
    var lng = [];
  
    $("#enterButton").click(function(){
        console.log("clicked");
        $("#landing-page").hide();
        });
 
    // 
    
    //set parameters for api information we need
     const params = 'swellHeight,swellDirection,swellPeriod,windDirection,windSpeed,waterTemperature,airTemperature,visibility,seaLevel';
   
     // function for changing meters to feet
              function toFeet(meter) {
                  return meter * 3.28;
              }
              
               // function for adding dynamically positioned images in the table
    $.fn.animateRotate = function(angle, duration, easing, complete) {
                               return this.each(function() {
                                   var $elem = $(this);

                                   $({ deg: 0 }).animate({ deg: angle }, {
                                       duration: duration,
                                       easing: easing,
                                       step: function(now) {
                                           $elem.css({
                                               transform: 'rotate(' + now + 'deg)'
                                           });
                                       },
                                       complete: complete || $.noop
                                   });
                               });
                           };
  
   $.ajax({
     url:"assets/life-guarded-beaches.json",
      dataType: "json",
      success: function(data){
          for(i = 0; i < data.length; i++){
              var nextLocation = data[i]
              locations.push(nextLocation);
          }
         
         
    
    //initiate map
function initMap(map) {
    $("#enterButton").click(function(){
        pushCard();
        
    });

    
    
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 6,
        center: { lat: 53.800, lng: -1.5491 },
        mapTypeId: 'hybrid',
        mapTypeControl:true,
        
     });
    
        for (i =0; i < locations.length; i++){
            
            var location = new google.maps.LatLng(locations[i].lat, locations[i].lng);
            
            addMarker(map, location );
            
            
  
            }
            
                          
             
        function pushCard(){
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
        };
              var autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', map);

        // Set the data fields to return when the user selects a place.
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var point = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
         
        });
         markers.push(point);

        autocomplete.addListener('place_changed', function() {
            $("#landing-page").hide();  
          infowindow.close();
          point.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(14);  // Why 17? Because it looks good.
          }
          point.setPosition(place.geometry.location);
          point.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindowContent.children['place-icon'].src = place.icon;
          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-address'].textContent = address;
          infowindow.open(map, point);
        });

       
              autocomplete.setOptions({strictBounds: true});
          
            
        }//initMap close
        
          var card = document.getElementById('pac-card');
        var input = document.getElementById('pac-input');


$("#past24hours").click(function(){
    count-=1;
    counter-=1;
    console.log(count);
      getMarineData(lat, lng);
       getWeatherData(lat,lng);
});             

$("#tableButton").click(function(){
    count+=1;
    counter+=1;
    console.log(count);
      getMarineData(lat, lng);
       getWeatherData(lat,lng);
       getTideTimes(lat,lng);
       $(".hide").removeClass("hide");
    //   $("#results").removeClass("hide");
    //   $("#chartDiv").removeClass("hide");
    //   $(".chartTitle").removeClass("hide");
    //   $(".featurette-divider").removeClass("hide")
});       

$("#next24hours").click(function(){
    count+=1;
    counter+=1;
    console.log(count);
      getMarineData(lat, lng);
       getWeatherData(lat,lng);
       getTideTimes(lat,lng);
      $("#results").removeClass("hide");
      $("#chartDiv").removeClass("hide")
});       
       

      
    

function addMarker(map, location){
    var marker = new google.maps.Marker({
        position: location,
        map: map
        
    });
    
     markers.push(marker);
     
     
     
function zoom(position){
  map.setZoom(14);
  map.panTo(position);
}
    
hide("lifeGuard");
hide("lifeBoat");
hide("marina");
hide("harbor");
hide("lighthouse");
hide("lock");
hide("landmark");
hide("inlet");
hide("bridge");
hide("ferry");


function findLabel( x, y) {
  for (var i = 0; i < locations.length; i++) {
      if (locations[i].lat == x && locations[i].lng == y) {
          return locations[i].label;
      }
  }
  return null;
} 



  
  marker.addListener('click', function(){
                
    $(".weatherButton").removeClass("hide");
              
                lat = marker.position.lat().toFixed(6);
                lng = marker.position.lng().toFixed(6);
                
                label = findLabel(lat, lng);
                

                 var infoWindow = new google.maps.InfoWindow();
                 infoWindow.setContent(label)
              infoWindow.open(label, marker);
                $("#placeName").html('<h2>' + label  + '</h2>')
                 zoom(marker.getPosition());
                if( count > -1){
                    count = 0;
                    counter = 0;
                    getMarineData(lat,lng);
                    getWeatherData(lat,lng);
                }              
        });
                 
}//addMarker close
                    
function getMarineData (lat, lng){
    fetch(`https://api.stormglass.io/point?lat=${lat}&lng=${lng}&params=${params}`, {
        headers: {
            //'Authorization': '9314edd6-c0d9-11e8-9f7a-0242ac130004-9314eee4-c0d9-11e8-9f7a-0242ac130004'
            //'Authorization': '7efc5c42-c57c-11e8-9f7a-0242ac130004-7efc5d5a-c57c-11e8-9f7a-0242ac130004'
            'Authorization': 'f1114c1a-c71c-11e8-83ef-0242ac130004-f1114d28-c71c-11e8-83ef-0242ac130004'
        }

    }).then(function gotData (response) {
        return response.json();
    }).then(function(data) {
      
        hours = data.hours;
        console.log(hours);
        
         
     
                           

                        //   document.getElementById("placename").textContent = locations[i].label;
                         
                        //   document.getElementById("wikilink").setAttribute('href', "https://en.wikipedia.org/wiki/" + locations[i].label);
                            
                            // helper function for extracting api info
                          const get = (p, o) =>
                              p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);
                          htmlString = '';
                                              var swellDirections = {};
                                              var windDirections = {};
                                              //loop for iterating through the data and returning every 6th hour
                                              for (i = count*24; i < (count+1)*24; i += 6) {
                                                     // create variables to select specific data for use later on
                                                  var DateStamp = new Date(hours[i].time);
                                                  var timeStamp = new Date(hours[i].time);
                                                  var convertedDate = DateStamp.toLocaleDateString();
                                                  var convertedTime = timeStamp.toLocaleTimeString();
                                                  var swellDirection = (get(['swellDirection', 0, 'value'], hours[i]));
                                                  var swellHeight = toFeet((get(['swellHeight', 0, 'value'], hours[i]))).toFixed(2);
                    
                                                  var visibility = (get(['visibility',0,'value'],hours[i]));
                                                  var waterTemperature = (get(['waterTemperature', 0, 'value'], hours[i]));
                                                  var windDirection = (get(['windDirection', 0, 'value'], hours[i]));
                                                  var windSpeed = (get(['windSpeed', 0, 'value'], hours[i]));
                                                  var airTemperature = (get(['airTemperature', 0, 'value'], hours[i]));
                                                  var swellPeriod = (get(['swellPeriod', 0, 'value'], hours[i]));
                                                  var seaLevel = (get(['seaLevel', 0, 'value'], hours[i]));
                    
                                                  // create id's for dynamically inserted image objects to allow each one to have its own style created from data values.
                                                  var imgId = "arrImage" + i.toString();
                                                  swellDirections[imgId] = swellDirection;
                    
                                                  var imgIdwind = "windArrImage" + i.toString();
                                                  windDirections[imgIdwind] = windDirection;
                    
                    
                    
                    
                                                  // build the table from the retrieved data
                                                  htmlString += '<tr  class="animatedParent" data-sequence="1000">';
                                                  htmlString += '<td>' + convertedDate +'\n'+ convertedTime + '</td>';
                                                  htmlString += '<td>' + '<img src="assets/images/if_Forward-64_32079.1.png"' + ' id="' + imgId + '"><p>' + swellDirection + '&deg;' + 'C </p>' + '</td>';
                                                  htmlString += '<td>' + swellHeight + ' Ft. </td>';
                                                  htmlString += '<td>' + swellPeriod + ' sec</td>';
                                                  htmlString += '<td>' + '<img src="assets/images/if_Forward-64_32079.1.png"' + ' id="' + imgIdwind + '"><p>' + windDirection + '&deg;' + 'C</p>' + '</td>';
                                                  htmlString += '<td>' + windSpeed + ' mph </td>';
                                                  htmlString += '<td>' + waterTemperature + '&deg;' + 'C</td>';
                                                  htmlString += '<td>' + airTemperature + '&deg;' + 'C</td>';
                                                  htmlString += '<td>' + visibility + ' km </td>';
                                                  htmlString += '<td>' + seaLevel + ' m </td>';
                                                  htmlString += '</tr>';
                        
  
                                        }
 
                          console.log("table");
                          $('#tideTable td').parent().remove(); // clear table for next set of data
                          $('#tideTable').append(htmlString); // add data to table
                          $('tr:nth-child(odd)').addClass('odd');
                         
                          $("p").removeClass("hide");

                            
                            
                            // rotate images arrow images in table
                          for (var image in swellDirections) {

                              $("#" + image).animateRotate(360 + swellDirections[image], 1000);
                              $("td p").hide();
                              $("#" + image).click(function() {
                                  $(this).siblings("p").slideToggle(500);


                              });
                          }

                          for (var image in windDirections) {
                              $("#" + image).animateRotate(360 + windDirections[image], 1000);
                              $("#" + image).click(function() {
                                  $(this).siblings("p").slideToggle(500);

                              });
                          }



                          });
                          
                         

      
 
                          
    
                          };
                         
               
           initMap();
             }// success function close
        });//ajax close   
        
       
        
      
            
     //request map markers on selection
       function show(category) {
        for (var i=0; i<markers.length; i++) {
              //  console.log(locations[i].cat);
          if (locations[i].cat === category) {
              //  console.log('success!');
            markers[i].setVisible(true);
            // console.log(markers[i]);
          }
      }
   }     
          
      function hide(category) {
          for (var i = 0; i < markers.length; i++) {
              if (locations[i].cat === category) {
                   markers[i].setVisible(false);
              }
        }
      }

      
 
    $(".checkbox").change(function(){
       
        var cat = $(this).attr("value" );                                   
        if ( $(this).is(":checked", true)){
        show(cat);
         console.log(cat);
    } else {
        hide(cat);
         console.log('hello');
       }
  });
  
   // make tide chart
        function getTideTimes(lat, lon){
            d3.select("#chartDiv").select("svg").remove();
             const svg = d3.select('#chartDiv')
                .append('svg')
                .attr('width', 3000)
                .attr('height', 300);
                
                //create margins and dims
                const margin = {top: 20, right: 20, bottom: 70, left: 70};
                const graphWidth = 3000 - margin.left - margin.right;
                const graphHeight = 300 - margin.top - margin.bottom;
                
                const graph = svg.append('g')
                .attr('width', graphWidth )
                .attr('height', graphHeight)
                .attr('transform', `translate(${margin.left},${margin.top})`);
                
                const xAxisGroup = graph.append('g')
                    .attr('transform', `translate(0, ${graphHeight})`);
                 const yAxisGroup = graph.append('g');
            
             d3.json('https://www.worldtides.info/api?heights&lat='+lat+'&lon='+lon+'&key=050b6b82-e0ab-48a4-a8f7-6da744f09782').then (function(data){
            
                var  Data = data.heights;
                Data.forEach(function(d) {
                   d3.format('d');
                    d.dt = new Date(d.dt * 1000).toLocaleString();
                     d.height = +d.height;
                });
            
                const rects = graph.selectAll('rect')
                    .data(Data);
               
                
                const y =d3.scaleLinear()
                    .domain([-3, d3.max(Data, d => d.height )])
                    .range([ graphHeight, -3]);
                    
                    
                const x = d3.scaleBand()
                    .domain(Data.map(item => item.dt))
                    .range([0, 3000])
                    .paddingInner(0.2)
                    .paddingOuter(0.2);
                
               
                
                rects.attr('width', x.bandwidth)
                    .attr('height', d => graphHeight - y(d.height))
                    .attr('fill', 'orange')
                    .attr('x', (d,i) => x(d.dt))
                     .attr('y', d => y(d.height));
                
                rects.enter()
                .append('rect')
                    .attr('width', x.bandwidth())
                    .attr('height', d => graphHeight - y(d.height))
                    .attr('fill', 'orange')
                    .attr('x', d => x(d.dt))
                    .attr('y', d => y(d.height));
                    
                    const xAxis = d3.axisBottom(x);
                    const yAxis = d3. axisLeft(y)
                    .ticks(7)
                    .tickFormat(d => d + ' metres');
                    
                    xAxisGroup.call(xAxis);
                    yAxisGroup.call(yAxis);
                    xAxisGroup.selectAll('text')
                    .attr('transform', 'rotate(-40)')
                    .attr('text-anchor', 'end');
                 });
                } 
  var weather = [];
  
  function getWeatherData(lat, lng){
            fetch(`https://api.apixu.com/v1/forecast.json?key=a44c5e70bf164253873132016182711&q=${lat},${lng}&days=4`,
    
                        ).then(function Data (response) {
                            return response.json();
                        }).then(function(data) {
                          
                            weather = data.forecast.forecastday;
                            console.log(weather);
                            
                           
                             var icon = weather[counter].day.condition.icon;
                             var condition = weather[counter].day.condition.text;
                             var sunrise = weather[counter].astro.sunrise;
                             var sunset = weather[counter].astro.sunset;
                             var precip =  weather[counter].day.totalprecip_mm;
                             var humidity = weather[counter].day.avghumidity;
                            
                            
                            
                             $("#weatherDiv").html('<h2>Weather Forecast</h2><ul><li class="icon"><img src="'+ icon +'"></li><li>'+ condition +'</li><li>Sunrise: '+ sunrise +'</li><li>Sunset: '+ sunset +'</li><li>Precipitation: '+ precip +' mm</li><li>Humidity: '+ humidity +'</li>')
                         });

                    } 
                    
            
            
          }//initialize function close
       
     
    

          
          google.maps.event.addDomListener(window, 'load',initialize);
    
      