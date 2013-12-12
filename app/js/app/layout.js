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
  var fixedHeaderHeight;

  var sizeFooter = function() {
    articleFooter.css('height', window.innerHeight);
  };

  var sizeSlideContainers = function() {
    var slideHeight = window.innerHeight - fixedHeaderHeight;

    slideContainers.each(function() {
      var container = $(this);
      var slides = container.find('.slide');

      container.height(slideHeight * slides.length);
      slides.height(slideHeight);
      slides.find('.background').height(slideHeight);
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
    articleFooter = $('.article-footer');

    fixedHeaderHeight = $('.navbar').outerHeight();

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