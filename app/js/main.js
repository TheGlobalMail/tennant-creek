require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/dist/lodash',
    settings: './settings',
    events: './libs/events',
    fatcontroller: './libs/fatcontroller',
    utils: './libs/utils',
    scroll: './libs/scroll',
    scrollTo: '../components/jquery.scrollTo/jquery.scrollTo'
  },
  shim: {
    scrollTo: {
      deps: ['jquery']
    }
  }
});

require([
  'jquery',
  'events',
  './app/main',
  'settings'
],
function($, events, app, settings) {
  if (settings.debugEvents) {
    window.fc = events;
  }
  $(app.init);
});
