$(document).ready(function() {

    $("#enter").click(function() {
        $("#landing").hide("slow");
        $("#map-canvas").removeClass("hide");
        $("#map-speech")
        $("#control").removeClass("hide");
        $(".navbar").removeClass("hide")
       
        initMap();
        
    });
  
      var myCanvas = document.getElementById("chartDiv");

    // create locations coordinates offshore close to named town to get marine information for that area.
    var locations = [
        ["Sennen", 50.070092, -5.767671],
        ["St Ives", 50.220352, -5.482625],
        ["Perranporth", 50.3437, -5.1731],
        ["Newquay", 50.4172, -5.1013],
        ["Mawgan Porth", 50.4617, -5.0449],
        ["Tintagel", 50.6734, -4.756],
        ["Widemouth Bay", 50.7874, -4.5617],
        ["Bude (Summerleaze)", 50.8349, -4.5584],
        ["Westward Ho", 51.0545, -4.2390],
        ["Porthleven", 50.0754, -5.3375],
        ["Lizard", 49.951, -5.206],
        ["Falmouth", 50.137, -5.030],
        ["Portloe", 50.2167, -4.8878],
        ["St Austell", 50.3277, -4.724],
        ["Looe", 50.3485, -4.4281],
        ["Lynton", 51.2380, -3.8401],
        ["Minehead", 51.2153, -3.4661]
    ];

    //set parameters for api information we need
    const params = 'swellHeight,swellDirection,swellPeriod,windDirection,windSpeed,waterTemperature,airTemperature,visibility,seaLevel';

    var hours;
    var htmlString;
   // function for adding dynamically positioned images
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




function makeChart(lat, lon){
 const svg = d3.select('#chartDiv')
    .append('svg')
    .attr('width', 2000)
    .attr('height', 300);
    
    //create margins and dims
    const margin = {top: 20, right: 20, bottom: 70, left: 70};
    const graphWidth = 2000 - margin.left - margin.right;
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
        d.dt = new Date(d.dt * 1000).toLocaleTimeString();
         d.height = +d.height;
    });
    
   

    
  const rects = graph.selectAll('rect')
    .data(Data);
   
    
    const y =d3.scaleLinear()
        .domain([-3, d3.max(Data, d => d.height )])
        .range([ graphHeight, -3]);
        
        
    const x = d3.scaleBand()
        .domain(Data.map(item => item.dt))
        .range([0, 2000])
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
                return function getData() {
                    fetch(`https://api.stormglass.io/point?lat=${locations[i][1]}&lng=${locations[i][2]}&params=${params}`, {
                        headers: {
                            'Authorization': '9314edd6-c0d9-11e8-9f7a-0242ac130004-9314eee4-c0d9-11e8-9f7a-0242ac130004'
                            //'Authorization': '7efc5c42-c57c-11e8-9f7a-0242ac130004-7efc5d5a-c57c-11e8-9f7a-0242ac130004'
                            //'Authorization': 'f1114c1a-c71c-11e8-83ef-0242ac130004-f1114d28-c71c-11e8-83ef-0242ac130004'
                        }

                    }).then(function gotData (response) {
                        return response.json();
                    }).then(function(data) {
                        htmlString = '';
                        hours = data.hours;
                        console.log(hours);
                        
                            $('svg').parent().replaceWith(makeChart(locations[i][1],locations[i][2]));
                        
                       
                         
                           document.getElementById("placeName").textContent = locations[i][0];
                          $("#placeName").addClass("shadow");
                             document.getElementById("wikilink").setAttribute('href', "https://en.wikipedia.org/wiki/" + locations[i][0]);
   
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
                            var swellDirection = (get([ 'swellDirection', 0, 'value'],hours[i]));
                            var swellHeight =(get([ 'swellHeight', 0, 'value'],hours[i]));
                            
                            var visibility = hours[i]['visibility'][0].value;
                            var waterTemperature =(get([ 'waterTemperature', 0, 'value'],hours[i]));
                            var windDirection = (get([ 'windDirection', 0, 'value'],hours[i]));
                            var windSpeed =(get([ 'windSpeed', 0, 'value'],hours[i]));
                            var airTemperature =(get([ 'airTemperature', 0, 'value'],hours[i]));
                            var swellPeriod =(get([ 'swellPeriod', 0, 'value'],hours[i]));
                            var seaLevel = (get([ 'seaLevel', 0, 'value'],hours[i]));
                            
                            // create id's for dynamically inserted image objects to allow each one to have its own style created from data values.
                            var imgId = "arrImage" + i.toString();
                            swellDirections[imgId] = swellDirection;
                            
                             var imgIdwind = "windArrImage" + i.toString();
                            windDirections[imgIdwind] = windDirection;
                            
                            
                            
                     
                            // build the table from the retrieved data
                            htmlString += '<tr  class="animatedParent" data-sequence="1000">';
                            htmlString += '<td>' + convertedDate + '<br></br>' + convertedTime + '</td>';
                            htmlString += '<td>' + '<img src="assets/images/if_Forward-64_32079.1.png"'+' id="' + imgId + '"><p>'+swellDirection+ '&deg;'+'C </p>' + '</td>';
                            htmlString += '<td>' + swellHeight + ' m </td>';
                            htmlString += '<td>' + swellPeriod + ' sec</td>';
                            htmlString += '<td>' + '<img src="assets/images/if_Forward-64_32079.1.png"'+' id="' + imgIdwind + '"><p>'+windDirection+ '&deg;'+'C</p>' + '</td>';
                            htmlString += '<td>' + windSpeed + ' mph </td>';
                            htmlString += '<td>' + waterTemperature +'&deg;'+ 'C</td>';
                            htmlString += '<td>' + airTemperature + '&deg;'+ 'C</td>';
                            htmlString += '<td>' + visibility + ' km </td>';
                            htmlString += '<td>' + seaLevel + ' m </td>';
                            htmlString += '</tr>';
  
                        }

                          $("#wikilink").removeClass("hide");                  
                         $("#chartDiv").removeClass("hide");
                         $("#chartDiv2").removeClass("hide");
                        $('#tideTable td').parent().remove();// clear table for next set of data
                        $('#tideTable').append(htmlString);// add data to table
                        $('tr:nth-child(odd)').addClass('odd');
                         $("#speech").addClass("hide");
                          $("#speech1").removeClass("hide");
                           $("p").removeClass("hide");
                       
                             
                        for(var image in swellDirections) {
                            
                           $("#" + image).animateRotate(360 + swellDirections[image], 1000);
                            $("td p").hide();
                            $("#" + image).click(function(){
                               $(this).siblings("p").slideToggle(500);
                               
                               
                            });
                        }
                        
                        for(var image in windDirections) {
                            $("#" + image).animateRotate(360+windDirections[image], 1000);
                             $("#" + image).click(function(){
                               $(this).siblings("p").slideToggle(500);
                               
                            });
                        }
                       
                       

                    });
                    infoWindow.setContent(locations[i][0]);
                    infoWindow.open(map, flag);
                };
                
                
                
              
               
                
            })(flag, i));
            
        }
      
  

 }


 
   
 
 
});