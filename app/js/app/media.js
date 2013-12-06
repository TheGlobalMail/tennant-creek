define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport'
], function($, _, scroll, events, viewport) {

  var slideContainers;
  var autoplayMedia;
  var autoplayAudio;
  var videoContainers;

  var jsCanPlayVideo = (function() {
    var video = document.createElement('video');
    video.play();
    return !video.paused;
  })();

  var playMedia = function(element) {
    element.play();
    if (element.paused !== true) {
      videoContainers.has(element).addClass('playing');
    }
  };

  var pauseMedia = function(element, preservePosition) {
    element.pause();
    if (!preservePosition) {
      element.currentTime = 0;
    }
    videoContainers.has(element).removeClass('playing');
  };

  // TODO: fade in/out
  var bindAutoplayMedia = function() {
    _.each(autoplayMedia, function(container) {
      var media = $(container).find('video, audio')[0];
//      var controls = container.find('.controls');
      var hasPlayed = false;

      if (jsCanPlayVideo) {
        scroll.track(container, {
          contained: function() {
            if (media.paused && !hasPlayed) {
              playMedia(media);
              hasPlayed = true;
            }
          },
          exit: function() {
            pauseMedia(media);
            hasPlayed = false;
          }
        });
      }

//      controls.on('click', function() {
//        if (element.paused) {
//          playMedia(element);
//          hasPlayed = true;
//        } else {
//          pauseMedia(element);
//        }
//      });
    });
  };

  var onEnterSlideContainer = function(element) {
    $(element).addClass('in-viewport');
  };

  var setBindings = function() {
    bindAutoplayMedia();

    _.each(slideContainers, function(element) {
      scroll.track(element, {
        enter: onEnterSlideContainer
      });
    })
  };

  var init = function() {
    slideContainers = $('.slide-container');
    autoplayMedia = $('.autoplay-when-visible');
    videoContainers = $('.video-container');

    setBindings();
    events.trigger('media:ready');
  };

  return {
    init: init
  };
});