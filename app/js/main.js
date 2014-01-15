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
  },
  packages: [{
    name: 'fc',
    location: '../components/fatcontroller'
  }]
});

require([
  'shims',
  'jquery',
  'settings',
  'fc',
  './app/main'
],
function(shims, $, settings, fc, app) {
  fc.debug = settings.debugEvents;
  $(app.init);
});
