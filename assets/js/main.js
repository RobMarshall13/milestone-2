$(document).ready(function() {
     
  
var rapid = new RapidAPI('https-milestone-2-robmarshall-c9users-io_5bc466fce4b085e3f408a248', '0ebd2fac-27c4-4257-b4c8-d7e0573063dc');

    $.ajax({
     url:"assets/life-guarded-beaches.json",
      dataType: "json",
      success: function(data){
          for(i = 0; i < data.length; i++){
              var nextLocation = data[i];
              locations.push(nextLocation);
          }
        }
      });
      
      
             


              
            // function for changing meters to feet
              function toFeet(meter) {
                  return meter * 3.28;
              }

             // set global variables for use later 
            var hours;
            var htmlString;
            var locations = [];
            var markers = new Array();
            var marker, i;
            var iconSrc = {};  
            
            //set parameters for api information we need
             const params = 'swellHeight,swellDirection,swellPeriod,windDirection,windSpeed,waterTemperature,airTemperature,visibility,seaLevel';
            // generic map icons to be changed later
            iconSrc['lifeGuard'] = 'http://labs.google.com/ridefinder/images/mm_20_red.png';
            iconSrc['lifeBoat'] = 'http://labs.google.com/ridefinder/images/mm_20_green.png';
            iconSrc['alllBeaches'] = 'http://labs.google.com/ridefinder/images/mm_20_yellow.png';
   
   
            // remove landing page
            $("#enter").click(function() {
                $("#landing").hide("slow");
                $("#map-canvas").removeClass("hide");
                $("#control").removeClass("hide");
                $(".navbar").removeClass("hide")
               
                initMap();
                
            });
            
            //tide chart toggle
             $("#chart").click(function() {
                  $("#chartDiv").slideToggle(500)
              });
          
  
   
    

   
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
        // make tide chart
        function makeChart(lat, lon){
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
         
//initiate map
function initMap() {
    
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 5,
        center: { lat: 53.800, lng: -1.5491 },
        mapTypeId: 'hybrid'
        
    });
    
    //request map markers on selection
                      
  
                       function show(category) {
                        
                        for (var i=0; i<markers.length; i++) {
                            //   console.log(locations[i].cat);
                          if (locations[i].cat === category) {
                            //   console.log('success!'); // This if statement is never getting hit!
                            markers[i].setVisible(true);
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
                          
                       
                          

       
                    $(".checkbox").click(function(){
                      
                                    var cat = $(this).attr("value" );                                   
                                    if ( $(this).is(":checked", true))
                                    {
                                        show(cat);
                                        // console.log(cat);
                                        // console.log(markers);
                                        // console.log(locations);
                                    }
                                    else
                                    {
                                        hide(cat);
                                        // console.log(cat);
                                    }
                                  });
  
        // Info Window initialize
            var infoWindow = new google.maps.InfoWindow();
 
       // iterate through locations array and push to markers array
          for( i=0 ; i < locations.length; i++){
              
                   marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i].lat,locations[i].long ),
                    map: map,
                    title: locations[i].label,
                    icon: iconSrc[locations[i].cat]
                    
                   
                });
                
                   hide("lifeGuard");
                          hide("lifeBoat");
                          hide("alllBeaches");
               
                markers.push(marker);
  
                // gets relevant api data when offshore marker is clicked
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function getData() {
                        fetch(`https://api.stormglass.io/point?lat=${locations[i].lat}&lng=${locations[i].long}&params=${params}`, {
                            headers: {
                                //'Authorization': '9314edd6-c0d9-11e8-9f7a-0242ac130004-9314eee4-c0d9-11e8-9f7a-0242ac130004'
                                'Authorization': '7efc5c42-c57c-11e8-9f7a-0242ac130004-7efc5d5a-c57c-11e8-9f7a-0242ac130004'
                                //'Authorization': 'f1114c1a-c71c-11e8-83ef-0242ac130004-f1114d28-c71c-11e8-83ef-0242ac130004'
                            }
    
                        }).then(function gotData (response) {
                            return response.json();
                        }).then(function(data) {
                            htmlString = '';
                            hours = data.hours;
                            console.log(hours);
     
                            // call chart function     
                          makeChart(locations[i].lat, locations[i].long);


                          document.getElementById("placeName").textContent = locations[i].label;
                          $("#placeName").addClass("shadow");
                          document.getElementById("wikilink").setAttribute('href', "https://en.wikipedia.org/wiki/" + locations[i].label);
                            
                            // helper function for extracting api info
                          const get = (p, o) =>
                              p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

                          var swellDirections = {};
                          var windDirections = {};
                          //loop for iterating through the data and returning every 6th hour
                          for (i = 0; i < 120; i += 6) {

                              console.log(hours[i]);
                              // create variables to select specific data for use later on
                              var DateStamp = new Date(hours[i].time);
                              var timeStamp = new Date(hours[i].time);
                              var convertedDate = DateStamp.toLocaleDateString();
                              var convertedTime = timeStamp.toLocaleTimeString();
                              var swellDirection = (get(['swellDirection', 0, 'value'], hours[i]));
                              var swellHeight = toFeet((get(['swellHeight', 0, 'value'], hours[i]))).toFixed(2);

                              var visibility = hours[i]['visibility'][0].value;
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
                          
                          $("#chartButton").removeClass("hide");
                          $("button").removeClass("hide")
                          $("#wikilink").removeClass("hide");
                        
                         
                          $('#tideTable td').parent().remove(); // clear table for next set of data
                          $('#tideTable').fadeOut(250).fadeIn(600).append(htmlString); // add data to table
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
                          infoWindow.setContent(locations[i].label + locations[i].url);
                          infoWindow.open(map, marker);
                          
                          rapid.call( `webcams.travel./webcams/list/nearby=${locations[i].lat},${locations[i].long},3`, { 
	'X-Mashape-Key': 'zEj3xVyla2mshD4nhEbK2eKtzHS4p1jLZ1rjsntODvg6i0c41K',
	'X-Mashape-Host': 'webcamstravel.p.rapidapi.com',
}).on('success', function (payload) {
	 /*YOUR CODE GOES HERE*/ 
}).on('error', function (payload) {
	 /*YOUR CODE GOES HERE*/ 
});
                          
      
                          };
 






                          })(marker, i));
                        
                         } 
                         
                        }
   
          });
    
      
    
   
                          
