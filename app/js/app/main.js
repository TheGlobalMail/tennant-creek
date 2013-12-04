define([
  'jquery',
  'lodash',
  'events',
  'scroll',
  'viewport',
  './layout',
  './media',
  './analytics'
], function($, _, events, scroll, viewport, layout, media, analytics) {
  'use strict';

  var body;

  var loadingStateUntil = [
    'layout:ready',
    'media:ready'
  ];

  var loadingStageComplete = _.after(loadingStateUntil.length, function() {
    scroll.checkElements();
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

    viewport.setViewport({
      topOffset: $('.navbar').outerHeight()
    });

    analytics.init();
    layout.init();
    media.init();
    scroll.init();
  };

  return {
    init: init
  };
});
