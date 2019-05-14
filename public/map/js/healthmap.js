// JS and JQuery to manipulate google maps API
// Creates a variable for our map object
var map;
var markers = [];
// Function to initialize the google maps
async function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.743991, lng: -74.032363},
        zoom: 12
    });
}


// Function to add map marker to map
function addMarker(coords, name){
    var marker = new google.maps.Marker({
        position: coords,
        title: name,
        animation: google.maps.Animation.DROP,
        map: map
    });

    // Function to add animation to map marker
    function toggleBounce(){
        if(marker.getAnimation() !== null){
            marker.setAnimation(null)
        }
        else {
            marker.setAnimation(google.maps.Animation.BOUNCE)
        }
    }
    marker.addListener('click', toggleBounce)
    markers.push(marker);
}

function setMapOnAll(map){
    for(let i=0; i < markers.length; i++){
        markers[i].setMap(map)
    }
}

function clearMarkers(){
    setMapOnAll(null)
}

function deleteMarkers(){
    clearMarkers();
    markers = [];
}

(async function($){
    
    // Disabled inate map functionality so the google API loads the map, and the AJAX request to server can be called to populate the map after object creation
    // Call to google map API for map generation
    await initMap()

    // Ajax request to get all from server
    var p = function () {
        var tmp = null;
        $.ajax({
            'async': false,
            'type': "GET",
            'dataType': 'json',
            'url': "/map/all",
            'success': function (data) {
                tmp = data;
            }
        });
        return tmp;
    }();

    for(let i=0; i < p.length; i++){
        addMarker({lat: p[i].location[0].lat, lng: p[i].location[1].long}, p[i].name)
    }
    
    // Set event listener for submission form
    $("#search-params").submit(function(event){
        
        // Clear error message
        $("#errmess").text("")
        // ins variable to get insurance selection
        var ins = $("#insurance-drop").val()
        // prc variable to get procedure selection
        var prc = $("#procedure-drop").val()
        
        if(ins !== '-' || prc !== '-'){
            var adata = {insurance: ins, procedure: prc}
            // Ajax request to load matches
            var r = function(){
                var tmp = null;
                $.ajax({
                    'async': false,
                    'type': "GET",
                    'data': adata,
                    'dataType': 'json',
                    'url': "/map/match",
                    'success': function (data) {
                        tmp = data;
                    }
                });
                return tmp;
            }();
            

            deleteMarkers();
            // If there are search results then we add the corresponding markers to the map
            if(r !== undefined && r !== null && r.length > 0){
                for(let i=0; i < r.length; i++){
                    addMarker({lat: r[i].location[0].lat, lng: r[i].location[1].long}, r[i].name)
                }
            }
            // Otherwise we display a message that says there were no search results
            else{
                // Set error message if there are no results
                $("#errmess").text("Sorry, there weren't any results for that search")
            }
        }
        // Otherwise reload all
        else{
            var p = function () {
                var tmp = null;
                $.ajax({
                    'async': false,
                    'type': "GET",
                    'dataType': 'json',
                    'url': "/map/all",
                    'success': function (data) {
                        tmp = data;
                    }
                });
                return tmp;
            }();
            deleteMarkers();
            for(let i=0; i < p.length; i++){
                addMarker({lat: p[i].location[0].lat, lng: p[i].location[1].long}, p[i].name)
            }
        }
        
        event.preventDefault();
    })

})(jQuery)