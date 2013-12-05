define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport'
], function($, _, scroll, events, viewport) {

  var slideContainers;
  var autoplayVideos;
  var autoplayAudio;
  var videoContainers;

  var jsCanPlayVideo = (function() {
    var video = document.createElement('video');
    video.play();
    return !video.paused;
  })();

  var play = function(element) {
    element.play();
    if (element.paused !== true) {
      videoContainers.has(element).addClass('playing');
    }
  };

  var pause = function(element, preservePosition) {
    element.pause();
    if (!preservePosition) {
      element.currentTime = 0;
    }
    videoContainers.has(element).removeClass('playing');
  };

  // TODO: fade in/out
  var bindAutoplayVideos = function() {
    _.each(autoplayVideos, function(element) {
      var container = videoContainers.has(element);
      var controls = container.find('.controls');
      var hasPlayed = false;

      if (jsCanPlayVideo) {
        scroll.track(element, {
          contained: function(element) {
            if (element.paused && !hasPlayed) {
              play(element);
              hasPlayed = true;
            }
          },
          exit: function(element) {
            pause(element);
            hasPlayed = false;
          }
        });
      }

      controls.on('click', function() {
        if (element.paused) {
          play(element);
          hasPlayed = true;
        } else {
          pause(element);
        }
      });
    });
  };

  var bindAutoplayAudio = function() {
    _.each(autoplayAudio, function(element) {
      var container = $(element);
      var audio = container.find('audio')[0];
      var hasPlayed = false;

      if (jsCanPlayVideo) {
        scroll.track(container, {
          contained: function(element) {
            if (audio.paused && !hasPlayed) {
              play(audio);
              hasPlayed = true;
            }
          },
          exit: function(element) {
            pause(audio);
            hasPlayed = false;
          }
        });
      }
    });
  };

  var onEnterSlideContainer = function(element) {
    $(element).addClass('in-viewport');
  };

  var setBindings = function() {
    bindAutoplayVideos();
    bindAutoplayAudio();

    _.each(slideContainers, function(element) {
      scroll.track(element, {
        enter: onEnterSlideContainer
      });
    })
  };

  var init = function() {
    slideContainers = $('.slide-container');
    autoplayVideos = $('video.autoplay-when-visible');
    autoplayAudio = $('div.autoplay-when-visible');
    videoContainers = $('.video-container');

    setBindings();
    events.trigger('media:ready');
  };

  return {
    init: init
  };
});