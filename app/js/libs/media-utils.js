define([], function() {

  var states = {
    fadeIn: 'fade-in',
    fadeOut: 'fade-out'
  };

  var defaultOptions = {
    fadeDuration: 750,
    fadeStepDelay: 20,
    volumeMax: 1,
    volumeMin: 0
  };

  var getStepAmount = function(options) {
    if (!options) {
      options = defaultOptions;
    }
    return options.fadeStepDelay / options.fadeDuration;
  };

  // TODO: add support for options arguments

  var fadeIn = function(sound, options) {

    options = _.extend(_.clone(defaultOptions), options);

    sound.__mediaUtilsState__ = states.fadeIn;
    sound.volume = 0;

    var stepAmount = getStepAmount(options);

    if (sound.paused || sound.readyState == 4) {
      sound.play();
    }

    var _fadeIn = function(sound, options) {
      if (sound.__mediaUtilsState__ !== states.fadeIn) {
        return;
      }
      var vol = sound.volume;
      if (vol < options.volumeMax) {
        sound.volume = Math.min(options.volumeMax, vol + stepAmount);
        sound.timer = setTimeout(function() {
          _fadeIn(sound, options);
        }, options.fadeStepDelay);
      } else {
        delete sound.__mediaUtilsState__;
      }
    };

    _fadeIn(sound, options);
  };

  var fadeOut = function(sound, options) {

    options = _.extend(_.clone(defaultOptions), options);

    sound.__mediaUtilsState__ = states.fadeOut;

    var stepAmount = getStepAmount(options);

    var _fadeOut = function(sound, options) {
      if (sound.__mediaUtilsState__ !== states.fadeOut) {
        return;
      }
      var vol = sound.volume;
      if (vol > options.volumeMin) {
        sound.volume = Math.max(options.volumeMin, vol - stepAmount);
        sound.timer = setTimeout(function() {
          _fadeOut(sound, options);
        }, options.fadeStepDelay);
      } else {
        sound.pause();
        delete sound.__mediaUtilsState__;
      }
    };

    _fadeOut(sound, options);
  };

  return {
    fadeIn: fadeIn,
    fadeOut: fadeOut
  };
});