define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport'
], function($, _, scroll, events, viewport) {

  var slideContainers;
  var autoplayMedia;
  var videoContainers;
  var parallaxBackgrounds;

  var jsCanPlayVideo = (function() {
    var video = document.createElement('video');
    video.play();
    return !video.paused;
  })();

  var playMedia = function(element, container) {
    element.play();
    if (element.paused !== true) {
      container.addClass('playing');
    }
    if (!container.hasClass('played')) {
      container.addClass('played')
    }
  };

  var pauseMedia = function(element, container) {
    element.pause();
    element.currentTime = 0;
    container.removeClass('playing');
  };

  var initProgressBar = function(element, progressBar) {
    var durationData = $(element).data('duration');
    durationData = durationData.split(':');
    var minutes = parseInt(durationData[0]);
    var seconds = parseInt(durationData[1]);
    var duration = (minutes * 60) + seconds;

    var progress = progressBar.find('.progress');

    var progressUpdater = function() {
      if (element.duration > duration) {
        duration = element.duration;
      }
      var percentage = (element.currentTime / duration) * 100;
      if (percentage > 100) {
        percentage = 100;
      }
      progress.css('width', percentage + '%');
      if (!element.paused) {
        setTimeout(progressUpdater, 50);
      }
    };

    progressUpdater();
  };

  // TODO: fade in/out
  var bindAutoplayMedia = function() {
    _.each(autoplayMedia, function(element) {
      var container = $(element);
      var media = container.find('video, audio')[0];
      var controls = container.find('.controls');
      var hasPlayed = false;
      var progressBar = container.find('.progress-bar');

      if (jsCanPlayVideo) {
        scroll.track(container, {
          contained: function() {
            if (media.paused && !hasPlayed) {
              playMedia(media, container);
              hasPlayed = true;
            }
          },
          exit: function() {
            pauseMedia(media, container);
            hasPlayed = false;
          }
        });
      }

      controls.on('click', function() {
        if (media.paused) {
          playMedia(media, container);
          hasPlayed = true;
        } else {
          pauseMedia(media, container);
        }
      });

      $(media).on('playing', function() {
        initProgressBar(media, progressBar);
      });

      $(media).on('ended', function() {
        container.removeClass('playing');
      });
    });
  };

  var initMedia = function() {
    _.each(autoplayMedia, function(element) {
      var container = $(element);
      var playIcon = 'icon-play';
      if (container.find('audio').length) {
        playIcon = 'icon-volume-up';
      }
      $(
        '<div class="controls">' +
          '<i class="play icon ' + playIcon + '"></i>' +
          '<i class="stop icon icon-stop"></i>' +
        '</div>' +
        '<div class="progress-bar">' +
          '<div class="progress" style="width: 60%;"></div>' +
        '</div>'
      ).appendTo(container);
    })
  };

  var onEnterSlideContainer = function(element) {
    $(element).addClass('in-viewport');
  };

  var onExitParallax = function(element) {
    $(element).removeClass('in-viewport');
  };

  var onEnterParallax = function(element) {
    $(element).addClass('in-viewport');
  };


  var setBindings = function() {
    bindAutoplayMedia();

    _.each(slideContainers, function(element) {
      scroll.track(element, {
        enter: onEnterSlideContainer
      });
    });

    _.each(parallaxBackgrounds, function(element) {
      scroll.track(element, {
        enter:  onEnterParallax,
        exit:   onExitParallax
      });
    });
  };

  var init = function() {
    slideContainers = $('.slide-container');
    autoplayMedia = $('.autoplay-when-visible');
    videoContainers = $('.video-container');
    parallaxBackgrounds = $('.text-over-bg-image');

    initMedia();
    setBindings();
    events.trigger('media:ready');
  };

  return {
    init: init
  };
});