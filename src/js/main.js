require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var $ = require("./lib/qsa");

var regionFilter = $.one("select.regionsList");
var trailRegion = $("[region]");

var mapElement = $.one("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;

var trailsData = window.trails;

var size = 16;
// trailsData.forEach(function(m, i) {
//   var marker = L.marker([m.lat, m.lng], {
//     icon: L.divIcon({
//       className: "locationMarker",
//       iconSize: [size, size]
//     })
//   });

//   marker.data = m;
//   m.marker = marker;

//   marker.addTo(map);
//   marker.bindPopup(m.name);
// })

// filter by region
var filterByRegion = function() {
  var value = regionFilter.value;

  trailRegion.forEach(function(item) {
    var region = item.getAttribute("region");
    if (region == value || ! value) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  })
};

var applyFilters = function() {
  filterByRegion();
};

regionFilter.addEventListener("change", applyFilters);