require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/dist/lodash',
    config: './config',
    events: './libs/events',
    fatcontroller: './libs/fatcontroller',
    utils: './libs/utils',
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
  'config'
],
function($, events, app, config) {
  if (config.debugEvents) {
    window.fc = events;
  }
  $(app.init);
});
