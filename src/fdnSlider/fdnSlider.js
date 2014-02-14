angular.module('mm.foundation.fdnSlider', ['mm.foundation.transition'])
  .controller('fdnSliderController', [
    '$scope',
    '$element',
    '$attrs',
    function($scope, $element, $attrs) {
      var _index = 0;

      return {
        index: function() {
          return $scope.index;
        }
      };
    }
  ])
  .directive('fdnSlider', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: "template/fdnSlider/fdnSlider.html",
      controller: 'fdnSliderController',
      link: function(scope, element, attrs) {
        var slideContainer = angular.element(element[0].querySelector('.orbit-slides-container'));
        var slideElements = slideContainer.children('li');
        var currentSlideElement;
        scope.wraparoundDisabled = false;

        function setup() {
          if(!angular.isUndefined(attrs['fdnSliderDisableWraparound'])) {
            scope.wraparoundDisabled = true;
          }
          slideElements.css('zIndex', 2);
        }

        scope.show = function(index) {
          if (currentSlideElement) {
            currentSlideElement.removeClass('active');
            currentSlideElement.css({zIndex: 2, marginLeft: "100%"});
          }
          scope.index = index;
          currentSlideElement = slideElements.eq(index);
          currentSlideElement
            .addClass('active')
            .css({zIndex: 4, marginLeft: "0%"});
        };

        scope.next = function() {
          if (this.hideNext()) { return; }

          var newIndex;

          if (this.atLastSlide()) {
            newIndex = 0;
          } else {
            newIndex = this.index + 1;
          }

          this.show(newIndex);
        };

        scope.prev = function() {
          if (this.hidePrev()) { return; }

          var newIndex;

          if (this.atFirstSlide()) {
            newIndex = this.lastIndex();
          } else {
            newIndex = this.index - 1; 
          }
          this.show(newIndex);
        };

        scope.hideNext = function() {
          if (scope.wraparoundDisabled === true) {
            return this.atLastSlide();
          } else {
            return false;
          }
        };

        scope.hidePrev = function() {
          if (scope.wraparoundDisabled === true) {
            return this.atFirstSlide();
          } else {
            return false;
          }
        };

        scope.atFirstSlide = function() {
          return this.index === 0;
        };

        scope.atLastSlide = function() {
          return this.index === this.lastIndex();
        };

        scope.lastIndex = function() {
          return slideElements.length - 1;
        };

        setup();
        scope.show(0);
      }
    };
  })
  .directive('fdnSlides', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: "template/fdnSlider/fdnSlides.html",
      link: function(scope, element, attrs) {
        var firstLi = element.find('li').first();
        element.css('height', firstLi.height() + 'px');
      }
    };
  });