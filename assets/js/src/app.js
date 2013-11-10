// Global
window.CarlinReport = {}; // TODO Global bad. Put in AMD module.
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		function (pos) {
			window.CarlinReport.coords = pos.coords
			setMapLocation()
		}
		, function (posErr) {
			// Handle error
		}
	);
} else {
	// TODO handle old browser.
}

var setMapLocation = function() {
	// create a map in the "map" div, set the view to a given place and zoom
	if (window.CarlinReport.coords) {
		var coords = window.CarlinReport.coords;
		map.setView([coords.latitude, coords.longitude], 13);
	} else {
		map.setView([43.172994, -79.236745], 13);
	}
}

var map = L.map('map');

// Set path to icons
L.Icon.Default.imagePath = '/images';


// create a new tile layer
var tileUrl = 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
    layer = new L.TileLayer(tileUrl, {maxZoom: 18});

// add the layer to the map
map.addLayer(layer);

var walkMarker = L.AwesomeMarkers.icon({
  prefix: 'map-icon',
  icon: 'trail-walking',
  markerColor: 'blue'
});

var runMarker = L.AwesomeMarkers.icon({
  prefix: 'map-icon',
  icon: 'walking',
  markerColor: 'red'
});

var cyclingMarker = L.AwesomeMarkers.icon({
  prefix: 'map-icon',
  icon: 'bicycling',
  markerColor: 'green'
});

// add a marker in the given location, attach some popup content to it and open the popup
L.marker([43.172994, -79.236745], { icon: walkMarker }).addTo(map)
    .bindPopup('This was a walking near-hit');

L.marker([43.153748, -79.246420], { icon: runMarker }).addTo(map)
    .bindPopup('This was a running near-hit');

L.marker([43.156637, -79.239277], { icon: cyclingMarker }).addTo(map)
    .bindPopup('This was a cycling near-hit'); 

(function($) {

  $(document).ready(function() {
    // Toggle between sections in the questionairre.
    $('.question-section [data-move-to]').on('click', function() {
      var $self = $(this)
        , section = $self.data('move-to')
        , $section = $(section);

      $('.question-section').hide();
      $section.show();
    }); 

    $('button').on('click', function() {
      $('.question-section').hide();
      $('#mode').show();

      $.magnificPopup.open({
        items: {
          src: '#popup',
          type: 'inline'
        }
      });
    });
	
    // Questionairre
    $('[data-input]').on('click', function() {
      var $self = $(this)
        , type  = $self.data('type')
        , value = $self.data('value');

      $('[data-type="'+type+'"]').removeClass('active');
      $self.addClass('active');

      $('#form-'+type).val(value);
    });

    $('#form-questions').on('submit', function() {
      var request = $.ajax({
        url: '/incidents',
        type: 'POST',
        data: {
            address: $('#form-address').val()
          , mode: $('#form-mode').val()
          , weather: $('#form-weather').val()
          , time: $('#form-time').val()
          , latitude: $('#form-latitude').val()
          , longitude: $('#form-longitude').val()
        }
      })
      .done(function(data) {
        console.log(data);
      })
      .fail(function(jqXHR, textStatus) {
        alert('Failed to post data. Whoops.');
      });

      return false;
    });
  });
})(jQuery);

