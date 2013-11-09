
// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([43.172994, -79.236745], 13);

// add an OpenStreetMap tile layer
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map);

// create a new tile layer
    var tileUrl = 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
    layer = new L.TileLayer(tileUrl, {maxZoom: 18});

    // add the layer to the map
    map.addLayer(layer);

// add a marker in the given location, attach some popup content to it and open the popup
L.marker([43.172994, -79.236745]).addTo(map)
    .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
    .openPopup();