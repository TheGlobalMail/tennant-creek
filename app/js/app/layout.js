define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport'
], function($, _, scroll, events, viewport) {

  var slideContainers;
  var navBar;
  var articleFooter;

  var sizeFooter = function() {
    articleFooter.css('height', window.innerHeight);
  };

  var sizeSlideContainers = function() {
    var navBarHeight = navBar.outerHeight();
    slideContainers.each(function() {
      var container = $(this);
      var slides = container.find('.slide');
      container.height((window.innerHeight - navBarHeight) * slides.length);
      // Size the individual slides
      _.each(slides, function(element) {
        $(element).css({
          height: window.innerHeight - navBarHeight
        });
      });
    });
  };

  var wordsInSpans = function() {
    // alternate version of screenreader hell
    var splitHeadlines = $('.headline.spans');
    splitHeadlines.each(function() {
      var headlineText = $(this).html().trim().split(' ');
      for (i in headlineText) {
        headlineText[i] = '<b class="word word-' + (headlineText.indexOf(headlineText[i]) + 1) + '">' + headlineText[i] + '</b>';   
      }
      var text = headlineText.join('');
      $(this).html(text);
      // ACTUAL HELL
      lettersInSpans();
    });
  };

  var lettersInSpans = function() {
    // definitely going to screenreader hell
    var splitHeadlineWords = $('.headline.spans .word');
    splitHeadlineWords.each(function() {
      var headlineText = $(this).html().trim().split('');
      for (i in headlineText)
          headlineText[i] = '<b class="char">' + headlineText[i] + '</b>';   
      var text = headlineText.join('');
      $(this).html(text);
    });
  };

  var init = function() {
    slideContainers = $('.slide-container');
    navBar = $('.navbar');
    articleFooter = $('.article-footer');

    sizeSlideContainers();
    wordsInSpans();
    // lettersInSpans();
    sizeFooter();

    events.trigger('layout:ready');
  };

  return {
    init: init
  };
});