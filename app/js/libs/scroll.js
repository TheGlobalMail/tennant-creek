define([
  'jquery',
  'lodash',
  'viewport'
], function ($, _, viewport) {

  var elementsToWatch = [];

  var defaultSettings = _.extend(viewport._defaultSettings, {
    // Bindings
    enter: null,
    exit: null,
    inside: null,
    outside: null,
    contained: null,
    intersects: null,
    above: null,
    below: null
  });

  var observe = function(element, settings) {
    var obj = {
      element: element,
      settings: _.extend(defaultSettings, settings)
    };
    elementsToWatch.push(obj);
    return obj;
  };

  var checkElements = function() {
    _.each(elementsToWatch, function(obj) {
      // Check if an element is within the viewport and trigger
      // events when an element enters or exits.
      var settings = obj.settings;
      var position = viewport.getElementPosition(obj.element, settings);

      if (position.in) {
        // Enter
        if (!obj.inViewport) {
          obj.inViewport = true;
          if (settings.enter) {
            settings.enter(obj, position);
          }
        }
        // Inside
        if (settings.inside) {
          settings.inside(obj, position);
        }
        // Contained
        if (position.contained && settings.contained) {
          settings.contained(obj, position)
        }
      } else if (position.out) {
        // Exit
        if (obj.inViewport) {
          obj.inViewport = false;
          if (settings.exit) {
            settings.exit(obj, position);
          }
        }
        // Outside
        if (settings.outside) {
          settings.outside(obj, position);
        }
      }
      if ((position.intersectsTop || position.intersectsBottom) && settings.intersects) {
        settings.intersects(obj, position);
      }
      // Above
      if (position.above && settings.above) {
        settings.above(obj, position);
      // Below
      } else if (position.below && settings.below) {
        settings.below(obj, position);
      }
    });
  };

  var init = function() {
    $(window).on('scroll', _.throttle(checkElements, 75));
  };

  $(init);

  return {
    observe: observe,
    checkElements: checkElements
  };
});