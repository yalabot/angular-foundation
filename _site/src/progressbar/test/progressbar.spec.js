describe('progressbar directive', function () {
  var $rootScope, element;
  beforeEach(module('mm.foundation.progressbar'));
  beforeEach(module('template/progressbar/progressbar.html', 'template/progressbar/progress.html', 'template/progressbar/bar.html'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.value = 22;
    element = $compile('<progressbar animate="false" value="value">{{value}} %</progressbar>')($rootScope);
    $rootScope.$digest();
  }));

  var BAR_CLASS = 'meter';

  function getBar(i) {
    return element.children().eq(i);
  }

  it('has a "progress" css class', function() {
    expect(element).toHaveClass('progress');
  });

  it('contains one child element with "bar" css class', function() {
    expect(element.children().length).toBe(1);
    expect(getBar(0)).toHaveClass(BAR_CLASS);
  });

  it('has a "bar" element with expected width', function() {
    expect(getBar(0).css('width')).toBe('22%');
  });

  it('transcludes "bar" text', function() {
    expect(getBar(0).text()).toBe('22 %');
  });

  it('it should be possible to add additional classes', function () {
    element = $compile('<progress class="secondary radius" max="200"><bar class="pizza"></bar></progress>')($rootScope);
    $rootScope.$digest();

    expect(element).toHaveClass('secondary');
    expect(element).toHaveClass('radius');

    expect(getBar(0)).toHaveClass('pizza');
  });

  describe('"max" attribute', function () {
    beforeEach(inject(function() {
      $rootScope.max = 200;
      element = $compile('<progressbar max="max" animate="false" value="value">{{value}}/{{max}}</progressbar>')($rootScope);
      $rootScope.$digest();
    }));

    it('adjusts the "bar" width', function() {
      expect(element.children().eq(0).css('width')).toBe('11%');
    });

    it('adjusts the "bar" width when value changes', function() {
      $rootScope.value = 60;
      $rootScope.$digest();
      expect(getBar(0).css('width')).toBe('30%');

      $rootScope.value += 12;
      $rootScope.$digest();
      expect(getBar(0).css('width')).toBe('36%');

      $rootScope.value = 0;
      $rootScope.$digest();
      expect(getBar(0).css('width')).toBe('0%');
    });

    it('transcludes "bar" text', function() {
      expect(getBar(0).text()).toBe('22/200');
    });
  });

  describe('"type" attribute', function () {
    beforeEach(inject(function() {
      $rootScope.type = 'success';
      element = $compile('<progressbar value="value" type="{{type}}"></progressbar>')($rootScope);
      $rootScope.$digest();
    }));

    it('should use correct classes', function() {
      expect(element).toHaveClass('progress');
      expect(element).toHaveClass('success');
    });

    it('should change classes if type changed', function() {
      $rootScope.type = 'alert';
      $rootScope.value += 1;
      $rootScope.$digest();

      expect(element).toHaveClass('progress');
      expect(element).not.toHaveClass('success');
      expect(element).toHaveClass('alert');
    });
  });
});
