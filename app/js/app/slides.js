define([
  'jquery',
  'lodash',
  'scroll',
  'viewport'
], function($, _, scroll, viewport) {

  var slideContainers;
  var slides;
  var slidesText;
  var fixedHeaderHeight;
  var slideRatio = 410 / 960; // h / w

//  var fixBackgrounds = function(backgrounds) {
//    backgrounds.each(function() {
//      var background = $(this);
//      background.css({
//        position: 'fixed',
//        top: fixedHeaderHeight,
//        height: background.outerHeight()
//      })
//    });
//  };
//
//  var unfixBackgrounds = function(backgrounds) {
//    backgrounds.each(function() {
//      $(this).attr('style', null);
//    });
//  };
//
//  var getSlideContainersTracker = function(element) {
//    var container = $(element);
//    var containerOffset = container.offset();
//    var slides = _.map(container.find('.slides'), function(element) {
//      var slide = $(element);
//      var text = slide.find('.text');
//      return {
//        text: text,
//        textOffset: viewport.getOffset(text),
//        background: slide.find('.background')
//      }
//    });
//    var backgrounds = container.find('.background');
//    var completelyWithin = false;
//
//    return function(obj) {
//      var position = obj.position;
//      if (position.intersectsTop && position.intersectsBottom) {
//        if (!completelyWithin) {
//          completelyWithin = true;
//          container.addClass('completely-within');
//          fixBackgrounds(backgrounds);
//        }
//      } else {
//        if (completelyWithin) {
//          completelyWithin = false;
//          container.removeClass('completely-within');
//          unfixBackgrounds(backgrounds)
//        }
//      }
//
//      // Handle slide transitions
////      console.log(obj.position);
//      _.each(slides, function(element) {
//        var position = viewport.getPositionOf(element, {
//          offset: viewport.getOffset(element),
//          viewportHeight: position.precomputed.viewportHeight,
//          scrollY: position.precomputed.scrollY
//        });
//        if (position.intersectsTop) {
//
//        }
//      })
//    };
//  };

//  var getSlideTracker = function(element) {
//    var slide = $(element);
//    var offset = viewport.getOffset(element);
//    var viewport;
//    return function(obj) {
//      var position = obj.position;
//      if (obj.position.offsetTopFromViewport)
//    };
//  };

  var addSlideBackgrounds = function() {
    // Add `.background` elements to slides without
    slides.not(':has(.background)').each(function() {
      $('<div class="background"></div>')
        .appendTo(this);
    });
  };

  var sizeBackgrounds = function() {

  };

  var setBindings = function() {
    slideContainers.each(function() {
      var slideContainer = $(this)
      var fixed = false;
      scroll.on(this, {
        inside: function(obj) {
          var position = obj.position;
          if (
            (position.intersectsTop && position.intersectsBottom) &&
            !fixed
          ) {
            fixed = true;
            slideContainer.find('.background').css('position', 'fixed');
          } else if (
            !(position.intersectsTop && position.intersectsBottom) &&
            viewport.getScrollY() > 0 &&
            fixed
          ) {
            slideContainer.find('.background').css('position', '');
            fixed = false;
          }
        },
        exit: function() {
          slideContainer.find('video').each(function() {
            this.pause()
          });
        }
      });
    });
    slidesText.each(function() {
      var slideText = $(this);
      scroll.on(this, {
        contained: function(obj) {
          var slide = slides.has(slideText);
          var slideContainer = slideContainers.has(slide);
          var background = slide.find('.background');
          var video = background.find('video');
          if (video.length) {
            if (video[0].readyState !== 4) {
              video[0].load();
            }
            if (video[0].paused) {
              video[0].play();
            }
          }
          background.css('opacity', 1);
          slideContainer.find('.background').not(background).each(function() {
            var otherBackground = $(this);
            var otherVideo = otherBackground.find('video');
            if (otherVideo.length) {
              otherVideo[0].pause();
            }
            otherBackground.css('opacity', 0);
          });
        }
      });
    });
  };

  var init = function() {
    slideContainers = $('.slide-container');
    slides = slideContainers.find('.slide');
    slidesText = slides.find('.text');

    fixedHeaderHeight = $('.navbar').outerHeight();

    addSlideBackgrounds();
    setBindings();
  };

  return {
    init: init
  };
});