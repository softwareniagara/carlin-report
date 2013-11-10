var validate = require('mongoose-validate')
  , mongoose = require('mongoose')
  , geocoder = require('geocoder')
  , crSchema
  , legend;


legend = {
  'mode': {
    'walking': 0,
    'running': 1,
    'cycling': 2
  },
  'weather': {
    'sunny': 0,
    'partly-cloudy': 1,
    'cloudy': 2,
    'raining': 3,
    'snowing': 4
  },
  'time': {
    'morning': 0,
    'afternoon': 1,
    'evening': 2,
    'night': 3
  }
};

crSchema = mongoose.Schema({
      'mode': { type: Number, get: getMode, set: setMode }
    , 'time': { type: Number, get: getTime, set: setTime }
    , 'weather': { type: Number, get: getWeather, set: setWeather }
    //, 'email':  { type: String, required: false, validate: [validate.email, 'invalid email address'] }
    , 'coords': []
    , 'address': String
    , 'created_at': Date
    , 'updated_at': Date
});

crSchema.pre('save', function(next) {
  var self = this;

  if (!self.coords && self.address) {
    geocoder.geocode(self.address, function(err, data) {
      var lat, lng;

      if (data && data.results && data.results.length > 0 && data.results[0].geometry && data.results[0].geometry.location) {
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
      }

      if (data && data.geometry && data.geometry.location) {
        
        lat = data.geometry.location.lat;
        lng = data.geometry.location.lng;
      }

      if (typeof lat !== 'undefined' && typeof lng !== 'undefined') {
        self.coords = [lat, lng];
      }

      next(err);
    });
  } else {
    next();
  }
});

function getMode(value) {
  console.log('this got called');
  for (var prop in legend.mode) {
    if (legend.mode.hasOwnProperty(prop)) {
      if (legend.mode[prop] === value) {
        return prop;
      }
    }
  }

  return 'unknown';
}

function getWeather(value) {
  for (var prop in legend.weather) {
    if (legend.weather.hasOwnProperty(prop)) {
      if (legend.weather[prop] === value) {
        return prop;
      }
    }
  }

  return 'unknown';
}

function getTime(value) {
  for (var prop in legend.time) {
    if (legend.time.hasOwnProperty(prop)) {
      if (legend.time[prop] === value) {
        return prop;
      }
    };
  }

  return 'unknown';
}

function setMode(value) {
  if (typeof value === 'string') {
    value = value.toLowerCase();

    if (legend.mode[value] !== 'undefined') {
      value = legend.mode[value];
    }
  }

  return value;
}

function setWeather(value) {
  if (typeof value === 'string') {
    value = value.toLowerCase();

    if (legend.weather[value] !== 'undefined') {
      value = legend.weather[value];
    }
  }

  return value;
}

function setTime(value) {
  if (typeof value === 'string') {
    value = value.toLowerCase();

    if (legend.time[value] !== 'undefined') {
      value = legend.time[value];
    }
  }

  return value;
}

module.exports = mongoose.model('CarlinReport', crSchema);
