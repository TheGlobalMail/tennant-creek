define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport'
], function($, _, scroll, events, viewport) {

  var slideContainers;
  var navBar;
  var articleFooter;

  var sizeFooter = function() {
    articleFooter.css('height', window.innerHeight);
  };

  var sizeSlideContainers = function() {
    var navBarHeight = navBar.outerHeight();
    slideContainers.each(function() {
      var container = $(this);
      var slides = container.find('.slide');
      container.height((window.innerHeight - navBarHeight) * slides.length);
      // Size the individual slides
      _.each(slides, function(element) {
        $(element).css({
          height: window.innerHeight - navBarHeight
        });
      });
    });
  };

  var init = function() {
    slideContainers = $('.slide-container');
    navBar = $('.navbar');
    articleFooter = $('.article-footer');

    sizeSlideContainers();
    sizeFooter();

    events.trigger('layout:ready');
  };

  return {
    init: init
  };
});