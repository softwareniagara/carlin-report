// Set path to icons
L.Icon.Default.imagePath = '/images';

// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([43.172994, -79.236745], 18);

// create a new tile layer
var tileUrl = 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
    layer = new L.TileLayer(tileUrl, {maxZoom: 18});

// add the layer to the map
map.addLayer(layer);

var redMarker = L.AwesomeMarkers.icon({
  prefix: 'fa',
  icon: 'frown-o',
  markerColor: 'red'
});

// add a marker in the given location, attach some popup content to it and open the popup
L.marker([43.172994, -79.236745], { icon: redMarker }).addTo(map)
    .bindPopup('The centre of the universe')
    .openPopup();  

(function($) {
  $(document).ready(function() {
    $('button').on('click', function() {
      console.log('clicked');
      $.magnificPopup.open({
        items: {
          src: '#popup',
          type: 'inline'
        }
      });
    });
  });
})(jQuery);