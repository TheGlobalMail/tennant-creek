define([
  'jquery',
  'lodash',
  'scroll',
  'events'
], function($, _, scroll, events) {

  var slideContainers;
  var navBar;
  var articleFooter;

  var sizeFooter = function() {
    console.log(articleFooter)
    articleFooter.css('height', window.innerHeight);
  };

  var sizeSlideContainers = function() {
    navBarHeight = navBar.outerHeight();
    slideContainers.each(function() {
      var container = $(this);
      var slides = container.find('.slide');
      var videoSlides = slides.has('video');
      container.height((window.innerHeight - navBarHeight) * slides.length);
      _.each(slides, function(element, i) {
        var slide = $(element);
        slide.css({
          height: window.innerHeight - navBarHeight,
//          top: navBarHeight,
          'z-index': slides.length - i + 1
        });
      });
    });
  };

  var setBindings = function() {

  };

  var init = function() {
    slideContainers = $('.slide-container');
    navBar = $('.navbar');
    articleFooter = $('.article-footer');

    setBindings();
    sizeSlideContainers();
    sizeFooter();

    events.trigger('layout:ready');
  };

  return {
    init: init
  };
});