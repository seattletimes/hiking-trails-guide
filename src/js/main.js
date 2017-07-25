require("./lib/social");
require("./lib/geolocation");
require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var $ = require("./lib/qsa");

var regionFilter = $.one("select.regionsList");
var trailRegion = $("[region]");
var milesFilter = $.one("select.milesFilter");
var trailMiles = $("[miles]");

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
var filterByRegion = function(list) {
  var value = regionFilter.value;
  if (!value) return;

  list.forEach(function(item) {
    var region = item.element.getAttribute("region");
    if (!region) return;
    if (region != value) {
      item.show = false;
    }
  });
};

//filter by miles
var filterByMiles = function(list) {
  var value = milesFilter.value;
  if (!value) return;
  var [min, max] = value.split(";").map(Number);

  list.forEach(function(item) {
    var miles = item.element.getAttribute("miles") * 1;
    if (miles < min || miles > max) {
      item.show = false;
    }
  });
};

var showHide = function(list) {
  list.forEach(function(item) {
    if (item.show) {
      item.element.classList.remove("hidden");
    } else {
      item.element.classList.add("hidden");
    }
  });
};

var applyFilters = function() {
  var filtered = $(".trail").map(el => ({ element: el, show: true }));
  [filterByMiles, filterByRegion, showHide].forEach(f => f(filtered));
};

regionFilter.addEventListener("change", applyFilters);
milesFilter.addEventListener("change", applyFilters);
applyFilters();