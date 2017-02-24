var map;
var markers = [];
var icon=[];
var placedWeaponIcons = [];



$("#activeWeapon").draggable();
$( "#activeWeapon" ).on( "dragstop", function( event, ui ) {
  confirm("By clicking okay you are confirming the location of this weapon and are initiating the countdown sequence")
});


var selection = document.getElementById('select');
$( "#select" ).change(function() {
    

      $.get('/weapon', {weapon: selection.value}, function(data){

        var img = document.getElementById("activeWeapon");

        img.src = data.imageUrl;

        console.log(img.src);

        icon.push(img);
        // console.log(icon);

        img.style.position = "absolute";
        img.style.top = "700px";
        img.style.left = "1300px";

        // alert("Click on the area of the map you want to target")
      });


});









var status = "false";

$("#scanBar").on("click", function(){
  if(status === "false"){
    status = "true";

    $.get("/scan", function(data){


        for (var i = 0; i < data.length; i++) {
         

          var marker = new google.maps.Marker({
            position: {lat: data[i].location.coordinates[0], lng: data[i].location.coordinates[1]},
            map: map
          });
          console.log(marker);
          markers.push(marker);

         
        }; 

    });

    $(".scanradius1").css("visibility", "visible");
    $(".scanradius2").css("visibility", "visible");

  } else {
    status = "false";

    for(var i=0; i<markers.length; i++){
      markers[i].setMap(null);
    }
    

    $(".scanradius1").css("visibility", "hidden");
    $(".scanradius2").css("visibility", "hidden");
  }
})












function initialize() {


      function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
      }
  

      function showPosition(position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;

          // Map options here
          var mapOptions = {
            center: { lat:position.coords.latitude, lng:position.coords.longitude},
            zoom: 16,
            disableDefaultUI:false
          };


          $.post('/locate', {latitude:latitude, longitude:longitude}, function (data) {
            console.log(data);
          });


          // Create a new map that gets injected into #map in our HTML
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions); 
        map.set("styles",[{featureType:"all",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{color:"#000000"},{lightness:13}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#144b53"},{lightness:14},{weight:1.4}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#08304b"}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#0c4152"},{lightness:5}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#0b434f"},{lightness:25}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"road.arterial",elementType:"geometry.stroke",stylers:[{color:"#0b3d51"},{lightness:16}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#000000"}]},{featureType:"transit",elementType:"all",stylers:[{color:"#146474"}]},{featureType:"water",elementType:"all",stylers:[{color:"#021019"}]}]);
        // console.log(map);
      }

    getLocation();


    
}

google.maps.event.addDomListener(window, 'load', initialize);






function timeout(){

   // window.onload(getLocation);
      // window.setInterval(getLocation, 30000);
  google.maps.event.addListener(map, 'zoom_changed', function() {
    for (var i = 0; i < placedWeaponIcons.length; i++) {
      console.log(placedWeaponIcons[i].setIcon(zoomIcons[map.getZoom()]));
    };
  });

 
  google.maps.event.addListener(map, 'click', function(event) {
  // No such thing as zoom level 0. A global variable or define within object.


    var img = icon[0].src;
    var str = img.length;

    var i = img.indexOf('/img');

    var imgpath = img.substring(i, str);


    function formatIcon(){
      var iconSize = map.getZoom();
      console.log(iconSize);

      markerImage = new google.maps.MarkerImage(imgpath,
                new google.maps.Size(iconSize, iconSize),
                new google.maps.Point(0, 0),
                new google.maps.Point(iconSize/2, iconSize/2));

      return markerImage;
    }

    
    

  // Create new marker at event click location and inject into map
      var marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });

      marker.setIcon(formatIcon());

      placedWeaponIcons.push(marker);


    });

  
}


setTimeout(timeout, 8000);





// Scan Btn
// $("#scanbtn").on("click", function(){

//     //Remove all markers. Reset
//     markers= [];

//     $.get("/scan", function(data){


//         for (var i = 0; i < data.length; i++) {
         

//           var marker = new google.maps.Marker({
//             position: {lat: data[i].location.coordinates[0], lng: data[i].location.coordinates[1]},
//             map: map
//           });
//           console.log(marker);
//           markers.push(marker);

         
//         }; 

//     });


// });














