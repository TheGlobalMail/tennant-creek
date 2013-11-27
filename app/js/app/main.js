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

  var loadingStateUntil = [
    'layout:ready',
    'media:ready'
  ];

  var loadingStageComplete = _.after(loadingStateUntil.length, function() {
    body.removeClass('loading');
    events.trigger('loading:complete');
  });

  var setBindings = function() {
    _.each(loadingStateUntil, function(eventName) {
      events.once(eventName, loadingStageComplete);
    });
  };

  var init = function() {
    body = $('body');

    setBindings();

    analytics.init();
    layout.init();
    media.init();
  };

  return {
    init: init
  };
});
