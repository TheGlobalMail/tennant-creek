define([
  'jquery',
  'lodash',
  'scroll',
  'events'
], function($, _, scroll, events) {

  var slideContainers;
  var autoplayVideos;
  var fixedHeaderHeight;

  // TODO: fade in/out
  var bindAutoplayVideos = function() {
    _.each(autoplayVideos, function(element) {
      var currentlyPlaying = false;
      var video = $(element);
      scroll.observe(video, {
        viewportTopOffset: fixedHeaderHeight,
        contained: function() {
          if (!currentlyPlaying) {
            element.play();
            currentlyPlaying = true;
          }
        },
        exit: function() {
          element.pause();
          element.currentTime = 0;
          currentlyPlaying = false;
        }
      });
    });
  };

  var onEnterSlideContainer = function(element) {
    var slideContainer = $(element);
    slideContainer.addClass('in-viewport');
  };

  var setBindings = function() {
    bindAutoplayVideos();

    scroll.observe(slideContainers, {
      enter: onEnterSlideContainer
    });
  };

  var init = function() {
    fixedHeaderHeight = $('.navbar').outerHeight();
    slideContainers = $('.slide-container');
    autoplayVideos = $('video.autoplay-when-visible');

    setBindings();
    events.trigger('media:ready');
  };

  return {
    init: init
  };
});