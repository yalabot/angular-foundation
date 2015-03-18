describe('dropdownToggle', function() {
  var $compile, $rootScope, $document, $location, $window, elm, toggleElm, targetElm, $position;

  function dropdown(id) {
    if (!id) {
      id = 'target';
    }
    var element = angular.element(
      '<div><a dropdown-toggle="#' + id + '">Trigger</a>' +
      '<ul id="' + id + '"><li>Hello</li></ul></div>'
    ).appendTo('body');
    return $compile(element)($scope);
  }

  afterEach(function() {
    if (elm) {
      elm.remove();
    }
  });

  beforeEach(module('mm.foundation.dropdownToggle'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _$location_, _$window_, _$position_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    $window = _$window_;
    $location = _$location_;
    $position = _$position_;
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
      toggleElm.click();
      expect(targetElm.css('display')).toBe('block');
      toggleElm.click();
      expect(targetElm.css('display')).toBe('none');
    });

    it('should close on elm click', function() {
      toggleElm.click();
      elm.click();
      expect(targetElm.css('display')).toBe('none');
    });
      
    it('should not close on click if elm has show-on-click attribute', function() {
        targetElm.attr('show-on-click', '');
        toggleElm.click();
        expect(targetElm.css('display')).toBe('block');
    });

    it('should close on document click', function() {
      toggleElm.click();
      expect(targetElm.css('display')).toBe('block');
      $document.click();
      expect(targetElm.css('display')).toBe('none');
    });

    it('should close on $location change', function() {
      toggleElm.click();
      $location.path('/foo');
      $rootScope.$apply();
      expect(targetElm.css('display')).toBe('none');
    });
  });

  describe('with multiple dropdowns', function() {
    it('should only allow one dropdown to be open at once', function() {
      var elm1 = dropdown('target1');
      var elm2 = dropdown('target2');
      elm1.find('a').click();
      elm2.find('a').click();
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

    beforeEach(function() {
      elm = dropdown('responsive');
      toggleElm = elm.find('a');
      targetElm = elm.find('ul');

      toggleElm.click();
    });

    it('should be full-width', function() {
      expect(targetElm.css('position')).toBe('absolute');
      expect(targetElm.css('max-width')).toBe('none');

      var expectedWidth = Math.round($window.innerWidth * 0.95);
      expect(targetElm.css('width')).toBe(expectedWidth + 'px');
    });

    it('should position pip', function() {
      var offset = $position.offset(toggleElm);
      var targetLeftOffset = parseInt($position.offset(targetElm).left, 10);

      // Find whatever left offset it should have
      var styles = getComputedStyle(targetElm[0], '::before');
      var left = styles.getPropertyValue('left');
      var pipWidth = styles.getPropertyValue('width').slice(0, -2);
      var expectedLeft = Math.round((offset.width - pipWidth) / 2, 10) + offset.left - targetLeftOffset;
      expect(left).toBe(expectedLeft + 'px');
    });
  });

  describe('when the parent element has a "has-dropdown" class', function() {
    beforeEach(function() {
      element = angular.element(
        '<div class="has-dropdown"><a dropdown-toggle="#target">Trigger</a>' +
          '<ul id="target"><li>hello</li></ul>' +
        '</div>'
      ).appendTo('body');
      elm = $compile(element)($scope);
      $scope.$digest();
      toggleElm = elm.find('a');
      targetElm = elm.find('ul');
    });

    it('adds the "hover" class to the containing has-dropdown element', function() {
      toggleElm.click();
      $scope.$digest();
      expect(elm.hasClass('hover')).toBe(true);
    });
  });
});

