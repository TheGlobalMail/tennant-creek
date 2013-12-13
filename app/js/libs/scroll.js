define([
  'jquery',
  'lodash',
  'viewport'
], function scroll($, _, viewport) {

  var trackedElements = [];

  var on = function(element, bindings) {
    var obj = {
      element: element,
      bindings: bindings
    };

    trackedElements.push(obj);

    return obj;
  };

  var off = function(element) {
    // TODO: this doesn't work as the jQuery objects aren't equal
    // probably need to settle down on using unwrapped elements
    trackedElements = trackedElements.filter(function(obj) {
      return obj.element !== element;
    });
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
      _.each(position, function(value, key) {
        if (value === true && bindings[key]) {
          matchedBindings.push(bindings[key]);
        }
      });

      _.each(matchedBindings, function(binding) {
        binding({
          element: obj.element,
          position: position
        });
      });
    });
  };

  var init = function() {
    updateElements();
    checkElements();
    $(window).on('scroll.checkElements', _.throttle(checkElements, 75));
    $(window).on('resize.updateElements', _.debounce(function() {
      updateElements();
      checkElements();
    }, 100));
  };

  return {
    init: init,
    on: on,
    off: off,
    checkElements: checkElements,
    updateElements: updateElements
  };

});