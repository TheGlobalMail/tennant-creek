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
  var slideshowBackground;

  var getSlideshowBackgroundColour = function(opacity) {
    return 'rgba(17, 17, 17, ' + opacity + ')';
  };

  var sizeSlideContainers = function() {
    var slideHeight = window.innerHeight - fixedHeaderHeight;

    slideContainers.each(function() {
      var container = $(this);
      var slides = container.find('.slide');
      var backgrounds = container.find('.background');

      container.height(slideHeight * slides.length);
      slides.height(slideHeight);
      backgrounds.height(slideHeight)
    });
  };

  var addSlideBackgrounds = function() {
    // Add `.background` elements to slides without
    slides.not(':has(.background)').each(function() {
      $('<div class="background"></div>')
        .appendTo(this);
    });
  };

  var setBindings = function() {
    slideContainers.each(function() {
      var slideContainer = $(this)
      var fixed = false;
      var backgroundTinted = false;

      var fixBG = function() {
        fixed = true;
        slideContainer
          .find('.background')
          .addClass('fixed')
          .css('top', fixedHeaderHeight);
      };
      var unfixBG = function() {
        fixed = false;
        slideContainer
          .find('.background')
          .removeClass('fixed')
          .css('top', '');
      };

      scroll.on(this, {
        enter: function() {
          slideContainer.find('video, audio').each(function() {
            if (this.readyState !== 4) {
              this.load();
            }
          });
        },
        inside: function(obj) {
          var position = obj.position;
          if (
            (position.intersectsTop && position.intersectsBottom) &&
            !fixed
          ) {
            fixBG();
          } else if (
            !(position.intersectsTop && position.intersectsBottom) &&
            viewport.getScrollY() > 0 &&
            fixed
          ) {
            unfixBG();
          }
          // Enter slideshow transition
          if (
            position.intersectsMiddle
          ) {
            backgroundTinted = true;
            if (position.intersectsTop && position.intersectsBottom) {
              slideshowBackground.css({
                'background-color': getSlideshowBackgroundColour(1),
                'z-index': 1
              });
            } else {
              var top = 0;
              var bottom;
              var elementPosition;
              var percentage;
              if (position.intersectsTop) {
                bottom = (position.viewportBottom - position.viewportMiddle) / 2;
                elementPosition = position.elementBottom - position.viewportMiddle;
              } else if (position.intersectsBottom) {
                bottom = (position.viewportMiddle - position.viewportTop) / 2;
                elementPosition = position.viewportMiddle - position.elementTop;
              }
              percentage = elementPosition / (bottom - top);
              slideshowBackground.css({
                'background-color': getSlideshowBackgroundColour(percentage),
                'z-index': 1
              });
            }
          } else {
            backgroundTinted = false;
            slideshowBackground.css({
              'background-color': getSlideshowBackgroundColour(0),
              'z-index': -1
            });
          }
        },
        outside: function() {
          // unfix everything in case the exit never fired
          if (fixed) {
            unfixBG();
          }
          if (backgroundTinted) {
            backgroundTinted = false;
            slideshowBackground.css({
              'background-color': getSlideshowBackgroundColour(0),
              'z-index': '-1'
            });
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
      var slide = slides.has(slideText);
      var prevSlide = slide.prev();
      var nextSlide = slide.next();
      var slideContainer = slideContainers.has(slide);
      var background = slide.find('.background');
      var prevBackground = prevSlide.find('.background');
      var nextBackground = nextSlide.find('.background');
      var video = background.find('video');
      var prevVideo = prevBackground.find('video');
      var nextVideo = nextBackground.find('video');
      scroll.on(this, {
        intersectsTop: function(obj) {
          if (nextSlide.length) {
            var position = obj.position;
            var top = position.elementTop;
            var bottom = position.elementBottom;
            var viewportPosition = position.viewportTop - top;
            var percentage = viewportPosition / (bottom - top);
            background.css('opacity', 1 - percentage);
            nextBackground.css('opacity', percentage);
            if (nextVideo.length && nextVideo[0].paused) {
              nextVideo[0].play();
            }
          }
        },
        contained: function(obj) {
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

  var hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };




  var init = function() {
    slideContainers = $('.slide-container');
    slides = slideContainers.find('.slide');
    slidesText = slides.find('.text');
    slideshowBackground = $('.slideshow-background');

    fixedHeaderHeight = $('.navbar').outerHeight();

    addSlideBackgrounds();
    sizeSlideContainers();
    setBindings();
  };

  return {
    init: init
  };
});