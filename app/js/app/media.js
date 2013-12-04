define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport'
], function($, _, scroll, events, viewport) {

  var slideContainers;
  var autoplayVideos;

  // TODO: fade in/out
  var bindAutoplayVideos = function() {
    _.each(autoplayVideos, function(element) {
      var currentlyPlaying = false;

      scroll.track(element, {
        contained: function(element) {
          if (!currentlyPlaying) {
            element.play();
            currentlyPlaying = true;
          }
        },
        exit: function(element) {
          element.pause();
          element.currentTime = 0;
          currentlyPlaying = false;
        }
      });
    });
  };

  var onEnterSlideContainer = function(element) {
    $(element).addClass('in-viewport');
  };

  var setBindings = function() {
    bindAutoplayVideos();

    _.each(slideContainers, function(element) {
      scroll.track(element, {
        enter: onEnterSlideContainer
      });
    })
  };

  var init = function() {
    slideContainers = $('.slide-container');
    autoplayVideos = $('video.autoplay-when-visible');

    setBindings();
    events.trigger('media:ready');
  };

  return {
    init: init
  };
});