define([
  'jquery',
  'lodash',
  'scroll',
  'events',
  'viewport'
], function($, _, scroll, events) {

  var slideContainers;
  var articleFooter;
  var fixedHeaderHeight;

  var sizeFooter = function() {
    articleFooter.css('height', window.innerHeight - fixedHeaderHeight);
  };

  var wordsInSpans = function() {
    // alternate version of screenreader hell
    var splitHeadlines = $('.headline.spans');
    splitHeadlines.each(function() {
      var headlineText = $(this).html().trim().split(' ');
      for (var i in headlineText) {
        if (headlineText.hasOwnProperty(i)) {
          headlineText[i] = '<b class="word word-' + (headlineText.indexOf(headlineText[i]) + 1) + '">' + headlineText[i] + '</b>';
        }
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
      for (var i in headlineText) {
        if (headlineText.hasOwnProperty(i)) {
          headlineText[i] = '<b class="char">' + headlineText[i] + '</b>';
        }
      }
      var text = headlineText.join('');
      $(this).html(text);
    });
  };

  var init = function() {
    slideContainers = $('.slide-container');
    articleFooter = $('.article-footer');

    fixedHeaderHeight = $('.navbar').outerHeight();

    wordsInSpans();
    // lettersInSpans();
    sizeFooter();

    events.trigger('layout:ready');
  };

  return {
    init: init
  };
});