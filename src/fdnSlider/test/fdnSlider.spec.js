describe('fdnSlider', function() {
  
  var $scope, $compile;
  var scope, element, container, slidesContainer, slides, activeSlide, prevButton, nextButton;

  beforeEach(module('mm.foundation.fdnSlider'));
  beforeEach(module('template/fdnSlider/fdnSlider.html'));
  beforeEach(module('template/fdnSlider/fdnSlides.html'));

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope;
    $compile = _$compile_;

  }));

  function createSlider(innerMarkup) {
    var markup = "<div><fdn-slider>" + innerMarkup + "</fdn-slider></div>";
    element = $compile(markup)($scope);
    $scope.$digest();
    findElements();
    return element;
  }

  function findElements() {
    container = element.find(".orbit-container");
    scope = container.scope();
    slidesContainer = element.find('.orbit-slides-container');
    slides = slidesContainer.children();
    activeSlide = function() { return slides.filter('li.active'); };
    prevButton = container.find('a.orbit-prev');
    nextButton = container.find('a.orbit-next');
  }

  function expectActiveSlide(index) {
    if (index === 'first') {
      index = 0;
    } else if (index === 'last') {
      index = slides.length - 1;
    }

    var slide = slidesContainer.find('li').eq(index);
    expect(slide.hasClass('active')).toBe(true);
    expect(slide.css('margin-left'));
    expect(slide[0].style['margin-left']).toEqual('0%');
  }

  function clickNext() {
    nextButton.click();
    scope.$digest();
  }

  function clickPrev() {
    prevButton.click();
    scope.$digest(); 
  }

  describe('fdnSliderController', function() {
    var ctrl, $element, $attrs;

    beforeEach(inject(function($controller) {

      $element = {}; $attrs = {};

      ctrl = $controller('fdnSliderController', { $scope: $scope, $element: $element, $attrs: $attrs });
    }));

    describe('index()', function() {
      it('returns the scope.index value', function() {
        $scope.index = 1;
        expect(ctrl.index()).toEqual($scope.index);
      });
    });

    describe('next()', function() {
      it('calls scope.next()');
    });

    describe('prev()', function() {
      it('calls scope.prev()');
    });

    describe('show(index)', function() {
      it('calls scope.show() with the correct value');
    });
  });

  describe('fdnSlider', function() {
    describe('initialization', function() {
      var slide1, slide2;

      var innerMarkup = '<fdn-slides>' +
                          '<li id="slide1"><img></li>' +
                          '<li id="slide2"><img></li>' +
                        '</fdn-slides>';
      
      beforeEach(function() {
        createSlider(innerMarkup);
        slide1 = slidesContainer.find('#slide1');
        slide2 = slidesContainer.find('#slide2');
      });

      it('transcludes the element contents into the slides container', function() {
        expect(slidesContainer.find('li').length).toEqual(2);
      });

      it('sets the first slide to active', function() {
        expect(slidesContainer.find('li').first().hasClass('active')).toBe(true);
      });

      it('sets the z-index of the active slide to 4', function() {
        expect(activeSlide().css('zIndex')).toEqual('4');
      });

      it('sets the z-index of all other slides to 2', function() {
        expect(slide2.css('zIndex')).toEqual('2');
      });
    });
    
    describe('slide navigation', function() {
      var slide1, slide2, slide3;

      var innerMarkup = '<fdn-slides>' +
                          '<li id="slide1"><img></li>' +
                          '<li id="slide2"><img></li>' +
                          '<li id="slide3"><img></li>' +
                        '</fdn-slides>';
      beforeEach(function() {
        createSlider(innerMarkup);
        slide1 = slidesContainer.find('#slide1');
        slide2 = slidesContainer.find('#slide2');
        slide3 = slidesContainer.find('#slide3');
      });

      describe('when the first slide is active', function() {

        it('shows the prev button', function() {
          expect(prevButton.hasClass('ng-hide')).toBe(false);
        });

        it('shows the next button', function() {
          expect(nextButton.hasClass('ng-hide')).toBe(false);
        });

        describe('when the next button is clicked', function() {
          it('removes the active class from the first slide', function() {
            expect(slide1.hasClass('active')).toBe(true);
            clickNext();
            expect(slide1.hasClass('active')).toBe(false);
          });

          it('sets margin-left to 100% on the first slide', function() {
            expect(slide1[0].style['margin-left']).toEqual('0%');
            clickNext();
            expect(slide1[0].style['margin-left']).toEqual('100%');
          });

          it('sets margin-left to 0% on the second slide', function() {
            expect(slide2[0].style['margin-left']).toEqual('');
            clickNext();
            expect(slide2[0].style['margin-left']).toEqual('0%');
          });

          it('adds the active class to the second slide', function() {
            expect(slide2.hasClass('active')).toBe(false);
            clickNext();
            expect(slide2.hasClass('active')).toBe(true);
          });

          it('sets the z-index of the second slide to 4', function() {
            expect(slide2.css('zIndex')).toEqual('2');
            clickNext();
            expect(slide2.css('zIndex')).toEqual('4');
          });

          it('sets the z-index of the first slide to 2', function() {
            expect(slide1.css('zIndex')).toEqual('4');
            clickNext();
            expect(slide1.css('zIndex')).toEqual('2');
          });
        });

        describe('when the prev button is clicked', function() {
          it('shows the last slide', function() {
            expectActiveSlide('first');
            clickPrev();
            expectActiveSlide('last');
          });
        });
      });

      describe('when a middle slide is active', function() {

        beforeEach(function() {
          scope.show(1);
          scope.$digest();
        });

        it('shows the prev button', function() {
          expect(prevButton.hasClass('ng-hide')).toBe(false);
        });

        it('shows the next button', function() {
          expect(nextButton.hasClass('ng-hide')).toBe(false);
        });

        describe('when the prev button is clicked', function() {
          it('removes the active class from the second slide', function() {
            expect(slide2.hasClass('active')).toBe(true);
            clickPrev();
            expect(slide2.hasClass('active')).toBe(false);
          });

          it('sets margin-left to 100% on the second slide', function() {
            expect(slide2[0].style['margin-left']).toEqual('0%');
            clickPrev();
            expect(slide2[0].style['margin-left']).toEqual('100%');
          });

          it('sets the z-index of the second slide to 2', function() {
            expect(slide2.css('zIndex')).toEqual('4');
            clickPrev();
            expect(slide2.css('zIndex')).toEqual('2');
          });

          it('shows the first slide', function() {
            expect(slide1.hasClass('active')).toBe(false);
            clickPrev();
            expectActiveSlide('first');
          });
        });

        describe('when the next button is clicked', function() {
          it('does not hide the next button', function() {
            expect(nextButton.hasClass('ng-hide')).toBe(false);
          });
        });
      });

      describe('when the last slide is active', function() {
        beforeEach(function() {
          scope.show(scope.lastIndex());
          scope.$digest();
        });

        it('does not hide the next button', function() {
          expect(nextButton.hasClass('ng-hide')).toBe(false);
        });

        describe('when the next button is clicked', function() {
          it('shows the first slide', function() {
            clickNext();
            expectActiveSlide('first');
          });
        });
      });

      describe('when fdn-slider-disable-wraparound option is present', function() {
        var markup;

        beforeEach(function() {
          markup = '<fdn-slider fdn-slider-disable-wraparound>' +
                     '<fdn-slides>' +
                       '<li id="slide1"><img></li>' +
                       '<li id="slide2"><img></li>' +
                       '<li id="slide3"><img></li>' +
                     '</fdn-slides>' +
                   '</fdn-slider>';

          element = $compile(markup)($scope);
          $scope.$digest();
          findElements();
        });

        describe('when the first slide is active', function() {
          it('hides the prev button', function() {
            expect(prevButton.hasClass('ng-hide')).toBe(true);
          });

          describe('when the next button is clicked', function() {

            it('shows the second slide', function() {
              clickNext();
              expectActiveSlide(1);
            });

            it('un-hides the prev button', function() {
              expect(prevButton.hasClass('ng-hide')).toBe(true);
              clickNext();
              expect(prevButton.hasClass('ng-hide')).toBe(false);
            });
          });
        });

        describe('when the last slide is active', function() {
          beforeEach(function() {
            scope.show(scope.lastIndex());
            scope.$digest();
          });

          it('hides the next button', function() {
            expect(nextButton.hasClass('ng-hide')).toBe(true);
          });

          describe('when the prev button is clicked', function() {
            it('shows the previous slide', function() {
              clickPrev();
              expectActiveSlide(1);
            });

            it('un-hides the next button', function() {
              clickPrev();
              expect(nextButton.hasClass('ng-hide')).toBe(false);
            });
          });
        });
      });
    });
  });

  describe('fdnSlides', function() {
    var innerMarkup = '<fdn-slides>' +
                        '<li style="height: 200px"></li>' +
                        '<li style="height: 300px"></li>' +
                      '</fdn-slides>';

    beforeEach(function() {
      createSlider(innerMarkup);
    });

    it('sets the element height to the height of the first slide', function() {
      expect(slidesContainer.height()).toEqual(200);
    });
  });
});