describe('dropdownToggle', function() {
  var $compile, $rootScope, $document, $location;

  beforeEach(module('mm.foundation.dropdownToggle'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _$location_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    $location = _$location_;

  }));

  function dropdown() {
    return $compile('<li><a dropdown-toggle="#target">Trigger</a>' +
                    '<ul id="target" dropdown-toggle="#target"><li>Hello</li></ul></li>')($rootScope);
  }
  
  it('should toggle on `a` click', function() {
    var elm = dropdown();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(true);
    elm.find('a').click();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(false);
    elm.find('a').click();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(true);
  });

  it('should toggle on `ul` click', function() {
    var elm = dropdown();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(true);
    elm.find('ul').click();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(false);
    elm.find('ul').click();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(true);
  });

  it('should close on elm click', function() {
    var elm = dropdown();
    elm.find('a').click();
    elm.click();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(true);
  });

  it('should close on document click', function() {
    var elm = dropdown();
    elm.find('a').click();
    $document.click();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(true);
  });

  it('should close on $location change', function() {
    var elm = dropdown();
    elm.find('a').click();
    $location.path('/foo');
    $rootScope.$apply();
    expect(elm.find('ul').hasClass('ng-hide')).toBe(true);
  });

  it('should only allow one dropdown to be open at once', function() {
    var elm1 = dropdown();
    var elm2 = dropdown();
    elm1.find('a').click();
    elm2.find('a').click();
    expect(elm1.find('ul').hasClass('ng-hide')).toBe(true);
    expect(elm2.find('ul').hasClass('ng-hide')).toBe(false);
  });
});
  
