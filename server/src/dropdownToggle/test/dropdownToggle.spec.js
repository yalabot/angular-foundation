describe('dropdownToggle', function() {
  var $compile, $rootScope, $document, $location;

  beforeEach(module('mm.foundation.dropdownToggle'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _$location_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    $location = _$location_;

  }));

  function dropdown(id) {
    if (!id) {
      id = 'target';
    }
    var element = angular.element(
      '<div><a dropdown-toggle="#' + id + '">Trigger</a>' +
      '<ul id="' + id + '"><li>Hello</li></ul></div>'
    ).appendTo('body');
    return $compile(element)($rootScope);
  }
  
  it('should toggle on `a` click', function() {
    var elm = dropdown();
    expect(elm.find('ul').css('display')).toBe('none');
    elm.find('a').click();
    expect(elm.find('ul').css('display')).toBe('block');
    elm.find('a').click();
    expect(elm.find('ul').css('display')).toBe('none');
    elm.remove();
  });

  it('should close on elm click', function() {
    var elm = dropdown();
    elm.find('a').click();
    elm.click();
    expect(elm.find('ul').css('display')).toBe('none');
    elm.remove();
  });

  it('should close on document click', function() {
    var elm = dropdown();
    elm.find('a').click();
    $document.click();
    expect(elm.find('ul').css('display')).toBe('none');
    elm.remove();
  });

  it('should close on $location change', function() {
    var elm = dropdown();
    elm.find('a').click();
    $location.path('/foo');
    $rootScope.$apply();
    expect(elm.find('ul').css('display')).toBe('none');
    elm.remove();
  });

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
  
