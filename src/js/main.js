require("./lib/social");
require("./lib/ads");
var geolocation = require("./lib/geolocation");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var $ = require("./lib/qsa");

var regionFilter = $.one("select.regionsList");
var trailRegion = $("[region]");
var milesFilter = $.one("select.milesFilter");
var trailMiles = $("[miles]");

var gpsLocator = $.one("img.gpsIcon");
var mobileGPSLocator = $.one(".mobileOnlyGPS");
var locationInput = $.one("input.address");
var addressSearch = $.one("button.addressGo");

var milesSorting = $.one(".searchByMileage");
var regionSorting = $.one(".searchByRegion");

var resultsCounter = $.one("div.results .resultsCounter");
var resultsField = $.one(".results");

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

var LAT_DEGREE = 69;
var LONG_DEGREE = Math.cos(47 / 360 * Math.PI * 2) * 69;

var sortByDistance = function([lat, lng]) {
  var trails = $(".trail").map(function(element) {
    var map = $.one("leaflet-map", element);
    return {
      element,
      lat: map.getAttribute("lat") * 1,
      lng: map.getAttribute("lng") * 1,
      distance: 0
    }
  });

  trails.forEach(function(t) {
    var xDistance = Math.abs(lng - t.lng) * LONG_DEGREE;
    var yDistance = Math.abs(lat - t.lat) * LAT_DEGREE;

    t.distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  });

  // trails.forEach(t => t.distance = (Math.random() * 100) | 0);
  trails.sort((a, b) => a.distance - b.distance);
  var container = $.one(".trail-info");
  // console.table(trails);
  trails.forEach(t => container.appendChild(t.element));

};

var getLocation = function(e) {
  e.preventDefault();
  locationInput.value = "Determining your location...";

  geolocation.gps(function(err, coords) {
    if (err) return console.log(err);
    // console.log(coords);
    locationInput.value = coords.map(n => n.toFixed(3)).join(", ");
    sortByDistance(coords);
  });
};

var getAddress = function(e) {
  geolocation.address(e.value, function(err, coords) {
    if (err) return console.log(err);
    sortByDistance(coords);
  })
};

var returnKey = function(r) {
  if (r.keyCode == 13) {
    var address = this.value;
    getAddress(this);
  };
};

var updateResults = function(list) {
  var counter = 0;

  list.forEach(function(i) {
    if (i.show == true) {
      counter += 1;
    };
  });
    resultsCounter.innerHTML = counter;
};

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
    updateResults(list);
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

  updateResults(list);
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



addressSearch.addEventListener("click", getAddress);
locationInput.addEventListener("keydown", returnKey)
gpsLocator.addEventListener("click", getLocation);
mobileGPSLocator.addEventListener("click", getLocation)
regionFilter.addEventListener("change", applyFilters);
milesFilter.addEventListener("change", applyFilters);

applyFilters();