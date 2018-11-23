$(function(){
   $(document).ready(function(){

function initMap() {
    
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 5,
        center: { lat: 53.800, lng: -1.5491 },
        mapTypeId: 'hybrid'
        
    });
     var card = document.getElementById('pac-card');
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
}
initMap();
});
});
