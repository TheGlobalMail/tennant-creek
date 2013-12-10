// viewport - utilities for working within the browser's viewport
// https://github.com/markfinger/viewport

define([], function viewport() {

  var settings = {
    // A positive number lowers the top of the viewport,
    // while a negative number lowers the top of the viewport
    topOffset: null,
    // A positive number raises the bottom of the
    // viewport, while a negative number lowers the
    // bottom of the viewport
    bottomOffset: null
  };

  var setViewport = function(viewportSettings) {
    // Altering the settings allows you to change the
    // scope of the viewport.

    _.extend(settings, viewportSettings);
  };

  var getScrollY = function() {
    // Cross-browser determination of the the amount of pixels scrolled

    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  };

  var getHeight = function() {
    // Returns the height of the viewport

    var height = window.innerHeight;

    if (settings.topOffset) {
      height -= settings.topOffset;
    }
    if (settings.bottomOffset) {
      height -= settings.bottomOffset;
    }

    return height;
  };

  var getPositionOf = function(element) {
    // Returns an object containing details about the position
    // of `element` relative to the viewport

    if (element.jquery) {
      element = element.get(0);
    }

    var viewportHeight = getHeight();
    var boundingRect = element.getBoundingClientRect();

    var boundingRectTop = boundingRect.top;
    var boundingRectBottom = boundingRect.bottom;
    if (settings.topOffset) {
      boundingRectTop -= settings.topOffset;
      boundingRectBottom -= settings.bottomOffset;
    }

    var topAboveViewportTop = boundingRectTop < 0;
    var topBelowViewportTop = !topAboveViewportTop;

    var topAboveViewportBottom = boundingRectTop <= viewportHeight;
    var topBelowViewportBottom = !topAboveViewportBottom;

    var bottomAboveViewportTop = boundingRectBottom < 0;
    var bottomBelowViewportTop = !bottomAboveViewportTop;

    var bottomAboveViewportBottom = boundingRectBottom <= viewportHeight;
    var bottomBelowViewportBottom = !bottomAboveViewportBottom;

    return {
      inside: !(topBelowViewportBottom || bottomAboveViewportTop),
      outside: topBelowViewportBottom || bottomAboveViewportTop,
      above: bottomAboveViewportTop,
      below: topBelowViewportBottom,
      contained: topBelowViewportTop && bottomAboveViewportBottom,
      intersectsTop: topAboveViewportTop && bottomBelowViewportTop,
      intersectsBottom: topAboveViewportBottom && bottomBelowViewportBottom
    };
  };

  return {
    getPositionOf: getPositionOf,
    setViewport: setViewport,
    getScrollY: getScrollY,
    getHeight: getHeight
  };
});
