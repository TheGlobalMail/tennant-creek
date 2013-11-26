define([
  'jquery',
  'lodash',
  'events',
  './layout',
  './media',
  './analytics'
], function($, _, events, layout, media, analytics) {
  'use strict';

  var body;

  var setBindings = function() {
    events.on('media:ready', function() {
      body.removeClass('loading');
    });
  };

  var init = function() {
    body = $('body');

    setBindings();

    layout.init();
    media.init();
    analytics.init();
  };

  return {
    init: init
  };
});
