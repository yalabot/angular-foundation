describe('dropdownToggle', function() {
  var $compile, $rootScope, $document, $location, elm, toggleElm, targetElm;

  beforeEach(module('mm.foundation.dropdownToggle'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _$location_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    $location = _$location_;
    $scope = $rootScope.$new();

  }));

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
});
  
