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
  var headline;
  var scrollPrompt;

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

  var setBindings = function() {
    scroll.on(headline, {
      enter: function() {
        scrollPrompt.removeClass('fade-out');
      },
      exit: function() {
        scrollPrompt.addClass('fade-out');
      }
    });
    $(window).on('resize', _.debounce(sizeFooter, 100))
  };

  var init = function() {
    slideContainers = $('.slide-container');
    articleFooter = $('.article-footer');
    headline = $('.headline');
    scrollPrompt = $('.scroll-prompt');

    fixedHeaderHeight = $('.navbar').outerHeight();

    wordsInSpans();
    // lettersInSpans();
    sizeFooter();

    setBindings();

    events.trigger('layout:ready');
  };

  return {
    init: init
  };
});