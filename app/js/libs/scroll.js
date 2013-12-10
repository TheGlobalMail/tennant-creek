define([
  'jquery',
  'lodash',
  'viewport'
], function scroll($, _, viewport) {

  var trackedElements = [];

  var track = function(element, bindings) {
    var obj = {
      element: element,
      bindings: bindings
    };

    trackedElements.push(obj);

    return obj;
  };

  var checkElements = function() {
    _.each(trackedElements, function(obj) {
      // Check if an element is within the viewport and trigger
      // specific bindings.

      var bindings = obj.bindings;
      var position = viewport.getPositionOf(obj.element);
      // Collect all the bindings to fire
      var matchedBindings = [];
      // See if we need to fire `enter` and `exit` bindings
      if (position.inside && !obj.inViewport) {
        obj.inViewport = true;
        if (bindings.enter) {
          matchedBindings.push(bindings.enter);
        }
      } else if (position.outside && obj.inViewport) {
        obj.inViewport = false;
        if (bindings.exit) {
          matchedBindings.push(bindings.exit);
        }
      }
      // See if we need to fire bindings specific to the position of the element
      _.each(position, function(value, key) {
        if (value === true && bindings[key]) {
          matchedBindings.push(bindings[key]);
        }
      });
      // Fire each binding
      _.each(matchedBindings, function(binding) {
        binding({
          element: obj.element,
          position: position
        });
      });
    });
  };

  var init = function() {
    $(window).on('scroll.scrollCheckElements', _.throttle(checkElements, 100));
  };

  return {
    init: init,
    track: track,
    checkElements: checkElements
  };

});