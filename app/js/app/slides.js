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
          .css({
            position: 'fixed',
            top: fixedHeaderHeight
          });
      };
      var unfixBG = function() {
        fixed = false;
        slideContainer
          .find('.background')
          .css({
            position: '',
            top: ''
          });
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
              $('#main').css('background-color', 'rgba(0,0,0,1)');
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
              $('#main').css('background-color', 'rgba(0,0,0,' + percentage + ')');
            }
          } else {
            backgroundTinted = false;
            $('#main').css('background-color', '');
          }
        },
        outside: function() {
          // unfix everything in case the exit never fired
          if (fixed) {
            unfixBG();
          }
          if (backgroundTinted) {
            backgroundTinted = false;
            $('#main').css('background-color', '');
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
    sizeSlideContainers();
    setBindings();
  };

  return {
    init: init
  };
});