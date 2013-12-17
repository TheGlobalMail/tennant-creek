define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport',
  'settings',
  'mediaUtils'
], function($, _, scroll, events, viewport, settings, mediaUtils) {

  var mediaAssets;
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

  var loadNextPrevMediaAssets = function(element) {
    if (element.jquery) {
      element = element.get(0);
    }

    var mediaAssetIndex;
    mediaAssets.each(function(index) {
      if (element === this) {
        mediaAssetIndex = index;
      }
    });

    if (mediaAssetIndex) {
      var nextMediaAsset = mediaAssets.get(mediaAssetIndex + 1);
      if (nextMediaAsset) {
        mediaUtils.load(nextMediaAsset);
      }
      var prevMediaAsset = mediaAssets.get(mediaAssetIndex - 1);
      if (prevMediaAsset) {
        mediaUtils.load(prevMediaAsset);
      }
    }
  };

  var playMedia = function(element, container) {
    mediaUtils.play(element);

    loadNextPrevMediaAssets(element);

    if (element.paused !== true) {
      container.addClass('playing');
    }
    if (!container.hasClass('played')) {
      container.addClass('played')
    }
  };

  var pauseMedia = function(element, container) {
    element.pause();
    container.removeClass('playing');
  };

  var fadeOutMedia = function(element, container) {
    mediaUtils.fadeOut(element);
    container.removeClass('playing');
  };

  var initProgressBar = function(element, progressBar) {
    var durationData = $(element).data('duration');
    durationData = durationData.split(':');
    var minutes = parseInt(durationData[0]);
    var seconds = parseInt(durationData[1]);
    var duration = (minutes * 60) + seconds;
    var hasFinished = false;

    var progress = progressBar.find('.progress');

    var progressUpdater = function() {
      if (element.duration > duration) {
        duration = element.duration;
      }
      var percentage = (element.currentTime / duration) * 100;
      if (hasFinished || percentage > 100) {
        percentage = 100;
      }
      progress.css('width', percentage + '%');
      if (!element.paused) {
        setTimeout(progressUpdater, 50);
      }
    };

    progressUpdater();

    $(element).on('ended', function() {
      // Ensure that the progress bar hits 100% on completion of the media
      hasFinished = true;
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
        scroll.on(container, {
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
    mediaAssets = $('video, audio');
    autoplayMedia = $('.autoplay-when-visible');
    videoContainers = $('.video-container');
    parallaxBackgrounds = $('.text-over-bg-image');

    updateMediaSources();
    addMediaControls();
    setBindings();
    events.trigger('media:ready');
  };

  return {
    init: init,
    playMedia: playMedia,
    pauseMedia: pauseMedia
  };
});