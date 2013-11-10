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

var setMapLocation = function() {
	// create a map in the "map" div, set the view to a given place and zoom
	if (window.CarlinReport.coords) {
		
		
	} else {
    window.CarlinReport.coords = {
      latitude: 43.172994,
      longitude: -79.236745
    }
	}

  var coords = window.CarlinReport.coords;
  map.setView([coords.latitude, coords.longitude], 13);

  var req = $.ajax({
    url: '/incidents',
    type: 'GET',
    data: {
      latitude: window.CarlinReport.coords.latitude,
      longitude: window.CarlinReport.coords.longitude 
    }
  }).done(function(data) {
    for (var i in data) {
      var incident = data[i];

      var iconType = walkMarker;

      switch (incident.mode) {
        case 'walking':
          iconType = walkMarker;
          break;
        case 'running':
          iconType = runMarker;
          break;
        case 'cycling':
          iconType = cyclingMarker;
          break;
      }

      if (incident.coords && incident.coords.length == 2) {
        var location = L.marker([incident.coords[0], incident.coords[1]], { icon: iconType })
        .bindPopup('<strong>Mode</strong>: '+incident.mode+'<br>\
          <strong>Weather</strong>: ' + incident.weather+'<br>\
          <strong>Time</strong>: '+incident.time+'<br>');
        incidents.addLayer(location);
      }
    }
  });
}

var map = L.map('map');

// Set path to icons
L.Icon.Default.imagePath = '/images';


// create a new tile layer
var tileUrl = 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
    layer = new L.TileLayer(tileUrl, {maxZoom: 18});

// add the layer to the map
map.addLayer(layer);

// add a marker in the given location, attach some popup content to it and open the popup
//var walkingExample = L.marker([43.172994, -79.236745], { icon: walkMarker })
    .bindPopup('This was a walking near-hit');

//var runningExample = L.marker([43.153748, -79.246420], { icon: runMarker })
    .bindPopup('This was a running near-hit');

//var cyclingExample = L.marker([43.156637, -79.239277], { icon: cyclingMarker })
    .bindPopup('This was a cycling near-hit'); 

//var incidents = L.layerGroup([walkingExample, runningExample, cyclingExample]);

map.addLayer(incidents);

	var getLocation = function() {
		if (navigator.geolocation) {
	    	navigator.geolocation.getCurrentPosition(
	    		function (pos) {
	   				console.debug(pos);
					// var coords = pos.coords;
	    		}
	    		, function (posErr) {
	    			console.debug(posErr);
	    		}
	    	);
		} else {
   			console.debug('Geolocation is disabled');
		}
	}
	getLocation();

(function($) {

  $(document).ready(function() {
    if (window.CarlinReport.coords) {
      $('#form-latitude').val(window.carlinReport.coords.latitude);
      $('#form-longitude').val(window.carlinReport.coords.longitude);
    }

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
        },
        callbacks: {
          close: resetAllTheThings
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
        var magnificPopup = $.magnificPopup.instance; 
        magnificPopup.close();

        if (data && data.coords) {
          var iconType = walkMarker;

          switch (data.mode) {
            case 'walking':
              iconType = walkMarker;
              break;
            case 'running':
              iconType = runMarker;
              break;
            case 'cycling':
              iconType = cyclingMarker;
              break;
          }


          var newLocation = L.marker([data.coords[0], data.coords[1]], { icon: iconType })
            .bindPopup('<strong>Mode</strong>: '+data.mode+'<br>\
              <strong>Weather</strong>: '+data.weather+'<br>\
              <strong>Time</strong>: '+data.time+'<br>');

          map.setView(new L.LatLng(data.coords[0], data.coords[1]), 13);

          incidents.clearLayers();
          incidents.addLayer(newLocation);

          var req = $.ajax({
            url: '/incidents',
            type: 'GET',
            data: {
              latitude: data.coords[0],
              longitude: data.coords[1] 
            }
          }).done(function(data) {
            for (var i in data) {
              var incident = data[i];

              var iconType = walkMarker;

              switch (incident.mode) {
                case 'walking':
                  iconType = walkMarker;
                  break;
                case 'running':
                  iconType = runMarker;
                  break;
                case 'cycling':
                  iconType = cyclingMarker;
                  break;
              }

              if (incident.coords && incident.coords.length == 2) {
                var location = L.marker([incident.coords[0], incident.coords[1]], { icon: iconType })
                .bindPopup('<strong>Mode</strong>: '+incident.mode+'<br>\
                  <strong>Weather</strong>: ' + incident.weather+'<br>\
                  <strong>Time</strong>: '+incident.time+'<br>');
                incidents.addLayer(location);
              }
            }
          });
        }
      })
      .fail(function(jqXHR, textStatus) {
        alert('Failed to post data. Whoops.');
      });

      return false;
    });

    function resetAllTheThings() {
      $('#form-address').val('');
      $('#form-mode').val('walking');
      $('#form-weather').val('sunny');
      $('#form-time').val();
      $('#form-latitude').val('');
      $('#form-longitude').val('');

      if (window.CarlinReport.coords) {
        $('#form-latitude').val(window.CarlinReport.coords.latitude);
        $('#form-longitude').val(window.CarlinReport.coords.longitude);
      }

      $('[data-type]').removeClass('active');
      $('[data-value="walking"]').addClass('active');
      $('[data-value="sunny"]').addClass('active');
      $('[data-value="morning"]').addClass('active');

      $('.question-section').attr('style', 'display: none;');
      $('.question-section#mode').attr('style', 'display: block;');
    }
  });
})(jQuery);