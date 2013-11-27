define([
  'jquery',
  'lodash',
  'events',
  'utils',
  'settings'
],function($, _, events, utils, settings) {

  var pointsToTrack = {};
  _.each(_.range(10, 101, 10), function(percentage) {
    pointsToTrack['Read to ' + percentage + '%'] = percentage;
  });

  var logScrollTracking = function() {
    var scrollPercentage = ((utils.getScrollY() + window.innerHeight) / document.body.clientHeight) * 100;
    _.each(pointsToTrack, function(percentage) {
      if (scrollPercentage >= percentage) {
        var eventName = 'Read to ' + percentage + '%';
        var event = ['_trackEvent', eventName];
        if (settings.debugAnalytics) {
          console.log(event);
        }
        window._gaq && _gaq.push.apply(null, event);
        delete pointsToTrack[eventName];
      }
    });
  };

  var setBindings = function() {
    events.once('loading:complete', function() {
      if (settings.debugAnalytics) {
        console.log('Now tracking for analytics')
      }
      $(window).on('scroll', _.throttle(logScrollTracking, 75));
    });
  };

  var init = function() {
    // Log the page load
    window._gaq && _gaq.push(['_trackEvent', 'Page load']);
    setBindings();
  };

  return {
    init: init
  };
});