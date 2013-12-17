define([
  'jquery',
  'lodash',
  'scroll',
  'mediaUtils'
], function($, _, scroll, mediaUtils) {

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

  var bindSlideContainers = function() {
    slideContainers.each(function() {
      var slideContainer = $(this)
      var fixed = false;
      var backgroundTinted = false;
      var mediaAssets = slideContainer.find('video, audio');

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
        trackDelay: 10,
        enter: function() {
          mediaAssets.each(function() {
            if (this.readyState !== 4) {
              this.load();
            }
          });
        },
        inside: function(obj) {
          var position = obj.position;
          var intersectsTopAndBottom = position.intersectsTop && position.intersectsBottom;

          if (intersectsTopAndBottom && !fixed) {
            fixBG();
          } else if (!intersectsTopAndBottom && position.viewportTop > 0 && fixed) {
            unfixBG();
          }

          // Enter slideshow transition
          if (position.intersectsMiddle) {
            backgroundTinted = true;
            if (intersectsTopAndBottom) {
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
            // Exit slideshow transition
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
          mediaAssets.each(function() {
            this.pause()
          });
        }
      });
    });
  };

  var bindSlideText = function() {
    slidesText.each(function() {
      var slideText = $(this);
      var slide = slides.has(slideText);
      var nextSlide = slide.next();
      var slideContainer = slideContainers.has(slide);
      var background = slide.find('.background');
      var otherBackgrounds = slideContainer.find('.background').not(background);
      var nextBackground = nextSlide.find('.background');
      var video = background.find('video').get(0);
      var nextVideo = nextBackground.find('video').get(0);

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
            if (nextVideo && nextVideo.paused) {
              mediaUtils.play(nextVideo);
            }
          }
        },
        contained: function(obj) {
          if (video) {
            mediaUtils.play(video);
          }
          background.css('opacity', 1);
          otherBackgrounds.each(function() {
            var otherBackground = $(this);
            var otherVideo = otherBackground.find('video').get(0);
            if (otherVideo) {
              mediaUtils.pause(otherVideo);
            }
            otherBackground.css('opacity', 0);
          });
        }
      });
    });
  };

  var setBindings = function() {
    bindSlideContainers();
    bindSlideText();

    $(window).on('resize', _.debounce(sizeSlideContainers, 100));
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