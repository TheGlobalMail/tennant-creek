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

  var updateElements = function() {
    _.each(trackedElements, function(obj) {
      obj.offset = viewport.getOffset(obj.element);
    });
  };

  var checkElements = function() {

    // Precompute these to reduce the load on `viewport`
    var viewportHeight = viewport.getHeight();
    var scrollY = viewport.getScrollY();

    _.each(trackedElements, function(obj) {
      // Check if an element is within the viewport and trigger
      // specific bindings.

      var bindings = obj.bindings;
      var precomputed = {
        scrollY: scrollY,
        viewportHeight: viewportHeight,
        offset: obj.offset
      };
      var position = viewport.getPositionOf(obj.element, precomputed);
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
        binding(obj.element, position);
      });
    });
  };

  var init = function() {
    updateElements();
    $(window).on('scroll.checkElements', _.throttle(checkElements, 75));
    checkElements();
  };

  return {
    init: init,
    track: track,
    checkElements: checkElements,
    updateElements: updateElements
  };

});