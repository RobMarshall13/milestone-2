     var tide = {};
                        
         $.ajax({ url: 'https://www.worldtides.info/api?heights&lat= 50.220352&lon=-5.482625&key=050b6b82-e0ab-48a4-a8f7-6da744f09782',  
         type: 'GET',  
         dataType: 'json',  
         data: tide,  
         success: function (tide, textStatus, xhr) {  
             console.log(tide);  
             
             
               
    
    function makeGraphs(error, tidedata) {
    var ndx = crossfilter(tidedata);
    
   
    show_tideTimes(ndx);
    
    dc.renderAll();
}
    

function show_tideTimes(ndx) {
    var dim = ndx.dimension(dc.pluck('heights'));
    var group = dim.group();
    
    dc.barChart("#chartDiv")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("dt")
        .yAxis().ticks(20);
}
    
makeGraphs();
         },  
         error: function (xhr, textStatus, errorThrown) {  
             console.log('Error in Operation');  
         }  
     });  
     
    