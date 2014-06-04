describe('tour', function() {
  var $window,
      $timeout,
      $compile,
      $tour,
      localStorage,
      elm,
      scope;

  beforeEach(function() {
    module('mm.foundation.tour');
    module('template/tour/tour.html');
  });

  beforeEach(inject(function($rootScope, _$window_, _$timeout_, _$compile_, _$tour_) {
    $window = _$window_;
    $timeout = _$timeout_;
    localStorage = $window.localStorage;
    $compile = _$compile_;
    $tour = _$tour_;
    scope = $rootScope;

    localStorage.removeItem('mm.tour.step');
    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'setItem');
  }));

  function findTourPopup(dom, index) {
    index = index || 1;
    var targetElm = dom.find('[step-index="' + index + '"]');
    return targetElm.next('[step-text-popup]');
  }

  describe('basic behavior', function() {
    beforeEach(function() {
      elm = $compile(
        '<div>' +
          '<div step-text="First step content" step-index="1">Step one</div>' +
          '<div step-text="Second step content" step-index="2">Step two</div>' +
        '</div>'
      )(scope);
      scope.$digest();
    });

    it('does not start the tour initially', function() {
      expect($tour.isActive()).toBe(false);
    });

    describe('when the tour is started', function() {
      beforeEach(function() {
        $tour.start();
        $timeout.flush();
      });

      it('is active', function() {
        expect($tour.isActive()).toBe(true);
      });

      it('starts on step 1', function() {
        expect($tour.current()).toEqual(1);
      });

      it('displays the first step', function() {
        popup = findTourPopup(elm, 1);
        expect(popup.length).toEqual(1);
        expect(popup.html()).toMatch(/first step content/i);
      });

      it('increments the step when advancing', function() {
        expect($tour.current()).toEqual(1);
        $tour.next();
        expect($tour.current()).toEqual(2);
      });

      it('displays the next step when advancing', function() {
        $tour.next();
        $timeout.flush();
        popup = findTourPopup(elm, 2);
        expect(popup.length).toEqual(1);
        expect(popup.html()).toMatch(/second step content/i);
      });
    });
  });
});