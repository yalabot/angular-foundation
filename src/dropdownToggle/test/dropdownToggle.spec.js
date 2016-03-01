describe('dropdownToggle', function() {
  var $compile, $rootScope, $document, $location, $window, elm, toggleElm, targetElm;

  function dropdown(id) {
    if (!id) {
      id = 'target';
    }
    var element = angular.element(
      '<div><a dropdown-toggle="#' + id + '">Trigger</a>' +
      '<ul id="' + id + '"><li>Hello</li></ul></div>'
    );
    $document.find('body').append(element);
    return $compile(element)($scope);
  }

  afterEach(function() {
    if (elm) {
      elm.remove();
    }
  });

  beforeEach(module('mm.foundation.dropdownToggle'));

  beforeEach(inject(function() {
    jasmine.addMatchers({
      // Deal with UAs that do subpixel layout
      toBeRounded: function(util, customEqualityTesters) {
        function compare(actual, expected, unit){

          var actualRounded = Math.round(Number(unit ? actual.replace(unit, '') : actual));
          var expectedRounded = Math.round(Number(unit ? String(expected).replace(unit, '') : expected));
          var passed = actualRounded === expectedRounded;

          return {
            pass: passed,
            message: "Expected '" + angular.mock.dump(actual) + "' to round to '" + expectedRounded + "'."
          };
        }

        return {compare: compare};
      }
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _$location_, _$window_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    $window = _$window_;
    $location = _$location_;
    $scope = $rootScope.$new();
  }));

  describe('with a single dropdown', function() {
    beforeEach(function() {
      elm = dropdown();
      toggleElm = elm.find('a');
      targetElm = elm.find('ul');
    });

    it('should initially hide the target element', function() {
      expect(targetElm.css('display')).toBe('none');
    });

    it('should toggle on `a` click', function() {
      expect(targetElm.css('display')).toBe('none');
      expect(targetElm.hasClass('f-open-dropdown')).toBe(false);
      toggleElm[0].click();
      expect(targetElm.css('display')).toBe('block');
      expect(targetElm.hasClass('f-open-dropdown')).toBe(true);
      toggleElm[0].click();
      expect(targetElm.css('display')).toBe('none');
      expect(targetElm.hasClass('f-open-dropdown')).toBe(false);
    });

    it('should close on elm click', function() {

      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, false);
      toggleElm[0].dispatchEvent(evt);

      evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, false);
      elm[0].dispatchEvent(evt);

      expect(targetElm.css('display')).toBe('none');
    });

    it('should close on body click', function() {
      toggleElm[0].click();
      expect(targetElm.css('display')).toBe('block');
      $document[0].querySelector('body').click();
      expect(targetElm.css('display')).toBe('none');
    });

    it('should close on $location change', function() {
      toggleElm[0].click();
      $location.path('/foo');
      $rootScope.$apply();
      expect(targetElm.css('display')).toBe('none');
    });

    it("should add/remove the 'expanded' class on toggle", function() {
      toggleElm[0].click();
      expect(toggleElm.hasClass('expanded')).toBe(true);
      toggleElm[0].click();
      expect(toggleElm.hasClass('expanded')).toBe(false);
    });
  });

  describe('with multiple dropdowns', function() {
    it('should only allow one dropdown to be open at once', function() {
      var elm1 = dropdown('target1');
      var elm2 = dropdown('target2');
      elm1[0].querySelector('a').click();
      elm2[0].querySelector('a').click();
      expect(elm1.find('ul').css('display')).toBe('none');
      expect(elm2.find('ul').css('display')).toBe('block');
      elm1.remove();
      elm2.remove();
    });
  });

  describe('on a mobile device', function() {
    var trueFn = Boolean.bind(null, true);
    var falseFn = Boolean.bind(null, false);

    angular.module('mm.foundation.dropdownToggle')
      .factory('mediaQueries', function() {
        return {small: trueFn, medium: falseFn, large: falseFn };
      });

    it('should be full-width', function() {
      elm = dropdown('responsive');
      toggleElm = elm.find('a');
      targetElm = elm.find('ul');

      toggleElm[0].click();

      expect(getComputedStyle(targetElm[0])['position']).toBe('absolute');
      expect(getComputedStyle(targetElm[0])['max-width']).toBe('none');

      var expectedWidth = $window.innerWidth * 0.95;
      expect(getComputedStyle(targetElm[0])['width']).toBeRounded(expectedWidth, 'px');
    });
  });

  describe('when the parent element has a "has-dropdown" class', function() {
    beforeEach(function() {
      element = angular.element(
        '<div class="has-dropdown"><a dropdown-toggle="#target">Trigger</a>' +
          '<ul id="target"><li>hello</li></ul>' +
        '</div>'
      );

      $document.find('body').append(element);

      elm = $compile(element)($scope);
      $scope.$digest();
      toggleElm = elm.find('a');
      targetElm = elm.find('ul');
    });

    it('adds the "hover" class to the containing has-dropdown element', function() {
      toggleElm[0].click();
      $scope.$digest();
      expect(elm.hasClass('hover')).toBe(true);
    });
  });
});
