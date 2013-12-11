define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport',
  'settings',
  'mediaUtils'
], function($, _, scroll, events, viewport, settings, mediaUtils) {

  var slideContainers;
  var autoplayMedia;
  var videoContainers;
  var parallaxBackgrounds;

  var updateMediaSources = function() {
    // Rename `data-src` attributes to `src`.
    // `data-src` is used to prevent the browser from caching
    // excessive amounts of media assets
    $('source[data-src]').each(function() {
      var source = $(this);
      source
        .attr('src', source.data('src'))
        .removeAttr('data-src');
    });
  };

  var playMedia = function(element, container) {
    // TODO: use a predictive method to precache vids
    if (element.readyState !== 4) {
      element.load();
    }

    if (element.currentTime > 0) {
      // Avoid clipping, but try to resume in place
      mediaUtils.fadeIn(element, {
        duration: 100
      });
    } else {
      mediaUtils.fadeIn(element);
    }

    if (element.paused !== true) {
      container.addClass('playing');
    }
    if (!container.hasClass('played')) {
      container.addClass('played')
    }
  };

  var fadeOutMedia = function(element, container) {
    mediaUtils.fadeOut(element);
    container.removeClass('playing');
  };

  var pauseMedia = function(element, container) {
    element.pause();
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

    // Ensure that the progress bar hits 100% on completion of the media
    $(element).on('ended', function() {
      progress.css('width', '100%');
    });
  };

  var bindAutoplayMedia = function() {
    _.each(autoplayMedia, function(element) {
      var container = $(element);
      var media = container.find('video, audio')[0];
      var controls = container.find('.controls');
      var progressBar = container.find('.progress-bar');
      var hasPlayed = false;

      if (settings.jsCanAutoplayMedia) {
        scroll.track(container, {
          contained: function() {
            if (media.paused && !hasPlayed) {
              playMedia(media, container);
              hasPlayed = true;
            }
          },
          exit: function() {
            fadeOutMedia(media, container);
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

  var addMediaControls = function() {
    _.each(autoplayMedia, function(element) {
      var container = $(element);
      var playIcon = 'icon-play';
      if (container.find('audio').length) {
        playIcon = 'icon-volume-up';
      }
      $(
        '<div class="controls">' +
          '<i class="play icon ' + playIcon + '"></i>' +
          '<i class="stop icon icon-pause"></i>' +
        '</div>' +
        '<div class="progress-bar">' +
          '<div class="progress"></div>' +
        '</div>'
      ).appendTo(container);
    });
  };

  var setBindings = function() {
    bindAutoplayMedia();
  };

  var init = function() {
    autoplayMedia = $('.autoplay-when-visible');
    videoContainers = $('.video-container');
    parallaxBackgrounds = $('.text-over-bg-image');

    updateMediaSources();
    addMediaControls();
    setBindings();
    events.trigger('media:ready');
  };

  return {
    init: init
  };
});