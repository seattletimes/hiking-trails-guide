var xhr = require("./xhr");

var endpoint = "https://maps.googleapis.com/maps/api/geocode/json?address="

module.exports = {
  address: function(address, callback) {
    address = address.replace(/\s/g, '+');
    var bounds = "&bounds=45.455486, -124.593898|49.056318, -117.027313";
    xhr(endpoint + address + bounds, function(err, data) {
      if (err) return callback(err);
      if (data.status == "ZERO_RESULTS") {
        // invalid entry
        callback("No results");
      } else if (data.results[0].formatted_address.indexOf("WA") < 0) {
        // not in WA
        callback("Not in WA");
      } else {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;

        callback(null, [lat, lng]);
      }
    });
  },
  gps: function(callback) {
    navigator.geolocation.getCurrentPosition(function(gps) {
      callback(null, [gps.coords.latitude, gps.coords.longitude]);
    }, err => callback(err));
  }
};