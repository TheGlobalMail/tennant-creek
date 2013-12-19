define([
  'jquery',
  'lodash',
  'events',
  'scroll',
  'viewport',
  './layout',
  './media',
  './analytics',
  './slides'
], function($, _, events, scroll, viewport, layout, media, analytics, slides) {
  'use strict';

  var body;

  var loadingStateUntil = [
    'layout:ready',
    'media:ready',
    'main:ready'
  ];

  var loadingStageComplete = _.after(loadingStateUntil.length, function() {
    _.defer(scroll.init);
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
    slides.init();

    events.trigger('main:ready');
  };

  return {
    init: init
  };
});
