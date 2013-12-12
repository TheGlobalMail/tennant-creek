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
      scroll.on(this, {
        inside: function(obj) {
          var position = obj.position;
          if (
            (position.intersectsTop && position.intersectsBottom) &&
            !fixed
          ) {
            fixed = true;
            slideContainer
              .find('.background')
                .css({
                  position: 'fixed',
                  top: fixedHeaderHeight
                });
          } else if (
            !(position.intersectsTop && position.intersectsBottom) &&
            viewport.getScrollY() > 0 &&
            fixed
          ) {
            slideContainer
              .find('.background')
                .css({
                  position: '',
                  top: ''
                });
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
    sizeSlideContainers();
    setBindings();
  };

  return {
    init: init
  };
});