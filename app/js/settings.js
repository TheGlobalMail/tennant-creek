define(function() {

  // Defaults
  var config = {
    // flags
    quiet: false,
    debug: false,
    debugEvents: false,
    debugAnalytics: false
  };

  if (location.search.indexOf('quiet') != -1) {
    // Suppress sound playback
    config.quiet = true;
  }

  if (location.search.indexOf('debug') != -1) {
    // Verbose logging
    config.debug = true;
  }

  if (
    location.search.indexOf('events') != -1 ||
    config.debug
  ) {
    // Log event bindings and triggers with stack traces
    config.debugEvents = true;
  }

  if (
    location.search.indexOf('analytics') != -1 ||
    config.debug
  ) {
    // Log events that we're tracking on Google Analytics
    config.debugAnalytics = true;
  }

  return config;

});
