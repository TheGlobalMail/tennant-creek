define([
  'jquery',
  'lodash',
  'scroll',
  'events'
], function($, _, scroll, events) {

  var autoplayVideos;

  var setBindings = function() {
    _.each(autoplayVideos, function(element) {
      var video = $(element);
      scroll.observe(video, {
        enter: function() {
          element.play();
        },
        exit: function() {
          element.pause();
          element.currentTime = 0;
        }
      });
    });
  };

  var init = function() {
    autoplayVideos = $('video.autoplay-when-visible');
    setBindings();
    events.trigger('media:ready');
  };

  return {
    init: init
  };
});