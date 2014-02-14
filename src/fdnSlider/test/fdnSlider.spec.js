describe('fdnSlider', function() {
  
  var scope, $compile;
  var element, container, slidesContainer, activeSlide, prevButton, nextButton;

  beforeEach(module('mm.foundation.fdnSlider'));
  beforeEach(module('template/fdnSlider/fdnSlider.html'));
  beforeEach(module('template/fdnSlider/fdnSlides.html'));

  beforeEach(inject(function($rootScope, _$compile_) {
    scope = $rootScope;
    $compile = _$compile_;

  }));

  function createSlider(innerMarkup) {
    var markup = "<div><fdn-slider>" + innerMarkup + "</fdn-slider></div>";
    element = $compile(markup)(scope);

    scope.$digest();
    container = element.find(".orbit-container");
    slidesContainer = element.find('.orbit-slides-container');
    activeSlide = function() { return slidesContainer.find('li.active'); };
    prevButton = container.find('a.orbit-prev');
    nextButton = container.find('a.orbit-next');

    return element;
  }

  describe('fdnSliderController', function() {
    var ctrl, $element, $attrs;

    beforeEach(inject(function($controller) {

      $element = {}; $attrs = {};

      ctrl = $controller('fdnSliderController', { $scope: scope, $element: $element, $attrs: $attrs });
    }));

    describe('index()', function() {
      it('returns the scope.index value', function() {
        scope.index = 1;
        expect(ctrl.index()).toEqual(scope.index);
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
        it('hides the prev button', function() {
          // debugger
          expect(prevButton.hasClass('ng-hide')).toBe(true);
        });
        describe('when next is clicked', function() {
          it('removes the active class from the first slide');
          it('adds the active class to the second slide');
          it('un-hides the prev button');
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