/**
* Add a URL parameter (or changing it if it already exists)
* @param {search} string  this is typically document.location.search
* @param {key}    string  the key to set
* @param {val}    string  value 
*/
var addUrlParam = function(search, key, val) {
  var newParam = key + '=' + val,
      params = '?' + newParam;

  // If the "search" string exists, then build params from it
  if (search) {
    // Try to replace an existance instance
    params = search.replace(new RegExp('[?&]' + key + '[^&]*'), '$1' + newParam);

    // If nothing was replaced, then add the new param to the end
    if (params === search) {
      params += '&' + newParam;
    }
  }

  return params;
};

var getURLParameter = function(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g , '%20')) || null;
};

var hasGetUserMedia = function() {
    // Note: Opera builds are unprefixed.
    var navigator = window.navigator;
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
};
