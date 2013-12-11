define([
  'jquery',
  'lodash',
  'scroll'
], function($, _, scroll) {

  var slideContainers;

  var onEnterSlideContainer = function(obj) {
    var container = $(obj.element);
    container.addClass('in-viewport');
  };

  var addSlideBackgrounds = function() {
    // Add `.background` elements to slides without
    slideContainers.each(function() {
      $(this).find('.slide:not(:has(.background))').each(function() {
        $('<div class="background"></div>').appendTo(this);
      });
    })
  };

  var setBindings = function() {
    slideContainers.each(function() {
      scroll.track(this, {
        enter: onEnterSlideContainer
      });
    });
  };

  var init = function() {
    slideContainers = $('.slide-container');

    addSlideBackgrounds();
    setBindings();
  };

  return {
    init: init
  };
});