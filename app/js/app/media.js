define([
  'events'
], function(events) {

  var init = function() {
    events.trigger('media:ready');
  };

  return {
    init: init
  };
});