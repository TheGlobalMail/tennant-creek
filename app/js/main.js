require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/dist/lodash',
    settings: './settings',
    events: './libs/events',
    fatcontroller: './libs/fatcontroller',
    viewport: './libs/viewport',
    scroll: './libs/scroll',
    scrollTo: '../components/jquery.scrollTo/jquery.scrollTo',
    mediaUtils: './libs/media-utils',
    shims: './libs/shims'
  },
  shim: {
    scrollTo: {
      deps: ['jquery']
    }
  }
});

require([
  'shims',
  'jquery',
  'events',
  './app/main',
  'settings'
],
function(shims, $, events, app, settings) {
  if (settings.debugEvents) {
    window.fc = events;
  }
  $(app.init);
});
