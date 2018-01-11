describe('rating directive', function() {
  var $rootScope, $compile, element;
  beforeEach(module('mm.foundation.rating'));
  beforeEach(module('template/rating/rating.html'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.rate = 3;
    element = $compile('<rating ng-model="rate"></rating>')($rootScope);
    $rootScope.$digest();
  }));

  function getStars() {
    return element.find('i');
  }

  function getStar(number) {
    return getStars().eq( number - 1 );
  }

  function getState(classOn, classOff) {
    var stars = getStars();
    var state = [];
    for (var i = 0, n = stars.length; i < n; i++) {
      state.push( (stars.eq(i).hasClass(classOn || 'fa-star') && ! stars.eq(i).hasClass(classOff || 'fa-star-o')) );
    }
    return state;
  }

  function getTitles() {
    var stars = getStars();
    return stars.toArray().map(function(star) {
      return angular.element(star).attr('title');
    });
  }

  function triggerKeyDown(keyCode) {
    var e = $.Event('keydown');
    e.which = keyCode;
    element.trigger(e);
  }

  it('contains the default number of icons', function() {
    expect(getStars().length).toBe(5);
    expect(element.attr('aria-valuemax')).toBe('5');
  });

  it('initializes the default star icons as selected', function() {
    expect(getState()).toEqual([true, true, true, false, false]);
    expect(element.attr('aria-valuenow')).toBe('3');
  });

  it('handles correctly the click event', function() {
    getStar(2).click();
    $rootScope.$digest();
    expect(getState()).toEqual([true, true, false, false, false]);
    expect($rootScope.rate).toBe(2);
    expect(element.attr('aria-valuenow')).toBe('2');

    getStar(5).click();
    $rootScope.$digest();
    expect(getState()).toEqual([true, true, true, true, true]);
    expect($rootScope.rate).toBe(5);
    expect(element.attr('aria-valuenow')).toBe('5');

    getStar(5).click();
    $rootScope.$digest();
    expect(getState()).toEqual([false, false, false, false, false]);
    expect($rootScope.rate).toBe(0);
    expect(element.attr('aria-valuenow')).toBe('0');
  });

  it('handles correctly the hover event', function() {
    getStar(2).trigger('mouseover');
    $rootScope.$digest();
    expect(getState()).toEqual([true, true, false, false, false]);
    expect($rootScope.rate).toBe(3);

    getStar(5).trigger('mouseover');
    $rootScope.$digest();
    expect(getState()).toEqual([true, true, true, true, true]);
    expect($rootScope.rate).toBe(3);

    element.trigger('mouseout');
    expect(getState()).toEqual([true, true, true, false, false]);
    expect($rootScope.rate).toBe(3);
  });

  it('rounds off the number of stars shown with decimal values', function() {
    $rootScope.rate = 2.1;
    $rootScope.$digest();

    expect(getState()).toEqual([true, true, false, false, false]);
    expect(element.attr('aria-valuenow')).toBe('2');

    $rootScope.rate = 2.5;
    $rootScope.$digest();

    expect(getState()).toEqual([true, true, true, false, false]);
    expect(element.attr('aria-valuenow')).toBe('3');
  });

  it('changes the number of selected icons when value changes', function() {
    $rootScope.rate = 2;
    $rootScope.$digest();

    expect(getState()).toEqual([true, true, false, false, false]);
    expect(element.attr('aria-valuenow')).toBe('2');
  });

  it('shows different number of icons when `max` attribute is set', function() {
    element = $compile('<rating ng-model="rate" max="7"></rating>')($rootScope);
    $rootScope.$digest();

    expect(getStars().length).toBe(7);
    expect(element.attr('aria-valuemax')).toBe('7');
  });

  it('shows different number of icons when `max` attribute is from scope variable', function() {
    $rootScope.max = 15;
    element = $compile('<rating ng-model="rate" max="max"></rating>')($rootScope);
    $rootScope.$digest();
    expect(getStars().length).toBe(15);
    expect(element.attr('aria-valuemax')).toBe('15');
  });

  it('handles readonly attribute', function() {
    $rootScope.isReadonly = true;
    element = $compile('<rating ng-model="rate" readonly="isReadonly"></rating>')($rootScope);
    $rootScope.$digest();

    expect(getState()).toEqual([true, true, true, false, false]);

    var star5 = getStar(5);
    star5.trigger('mouseover');
    $rootScope.$digest();
    expect(getState()).toEqual([true, true, true, false, false]);

    $rootScope.isReadonly = false;
    $rootScope.$digest();

    star5.trigger('mouseover');
    $rootScope.$digest();
    expect(getState()).toEqual([true, true, true, true, true]);
  });

  it('should fire onHover', function() {
    $rootScope.hoveringOver = jasmine.createSpy('hoveringOver');
    element = $compile('<rating ng-model="rate" on-hover="hoveringOver(value)"></rating>')($rootScope);
    $rootScope.$digest();

    getStar(3).trigger('mouseover');
    $rootScope.$digest();
    expect($rootScope.hoveringOver).toHaveBeenCalledWith(3);
  });

  it('should fire onLeave', function() {
    $rootScope.leaving = jasmine.createSpy('leaving');
    element = $compile('<rating ng-model="rate" on-leave="leaving()"></rating>')($rootScope);
    $rootScope.$digest();

    element.trigger('mouseleave');
    $rootScope.$digest();
    expect($rootScope.leaving).toHaveBeenCalled();
  });

  describe('keyboard navigation', function() {
    it('supports arrow keys', function() {
      triggerKeyDown(38);
      expect($rootScope.rate).toBe(4);

      triggerKeyDown(37);
      expect($rootScope.rate).toBe(3);
      triggerKeyDown(40);
      expect($rootScope.rate).toBe(2);

      triggerKeyDown(39);
      expect($rootScope.rate).toBe(3);
    });

    it('supports only arrow keys', function() {
      $rootScope.rate = undefined;
      $rootScope.$digest();

      triggerKeyDown(36);
      expect($rootScope.rate).toBe(undefined);

      triggerKeyDown(41);
      expect($rootScope.rate).toBe(undefined);
    });

    it('can get zero value but not negative', function() {
      $rootScope.rate = 1;
      $rootScope.$digest();

      triggerKeyDown(37);
      expect($rootScope.rate).toBe(0);

      triggerKeyDown(37);
      expect($rootScope.rate).toBe(0);
    });

    it('cannot get value above max', function() {
      $rootScope.rate = 4;
      $rootScope.$digest();

      triggerKeyDown(38);
      expect($rootScope.rate).toBe(5);

      triggerKeyDown(38);
      expect($rootScope.rate).toBe(5);
    });
  });

  describe('custom states', function() {
    beforeEach(inject(function() {
      $rootScope.classOn = 'icon-ok-sign';
      $rootScope.classOff = 'icon-ok-circle';
      element = $compile('<rating ng-model="rate" state-on="classOn" state-off="classOff"></rating>')($rootScope);
      $rootScope.$digest();
    }));

    it('changes the default icons', function() {
      expect(getState($rootScope.classOn, $rootScope.classOff)).toEqual([true, true, true, false, false]);
    });
  });

  describe('`rating-states`', function() {
    beforeEach(inject(function() {
      $rootScope.states = [
        {stateOn: 'sign', stateOff: 'circle'},
        {stateOn: 'heart', stateOff: 'ban'},
        {stateOn: 'heart'},
        {stateOff: 'off'}
      ];
      element = $compile('<rating ng-model="rate" rating-states="states"></rating>')($rootScope);
      $rootScope.$digest();
    }));

    it('should define number of icon elements', function() {
      expect(getStars().length).toBe(4);
      expect(element.attr('aria-valuemax')).toBe('4');
    });

    it('handles each icon', function() {
      var stars = getStars();

      for (var i = 0; i < stars.length; i++) {
        var star = stars.eq(i);
        var state = $rootScope.states[i];
        var isOn = i < $rootScope.rate;

        expect(star.hasClass(state.stateOn)).toBe(isOn);
        expect(star.hasClass(state.stateOff)).toBe(!isOn);
      }
    });
  });

  describe('setting ratingConfig', function() {
    var originalConfig = {};
    beforeEach(inject(function(ratingConfig) {
      $rootScope.rate = 5;
      angular.extend(originalConfig, ratingConfig);
      ratingConfig.max = 10;
      ratingConfig.stateOn = 'on';
      ratingConfig.stateOff = 'off';
      element = $compile('<rating ng-model="rate"></rating>')($rootScope);
      $rootScope.$digest();
    }));
    afterEach(inject(function(ratingConfig) {
      // return it to the original state
      angular.extend(ratingConfig, originalConfig);
    }));

    it('should change number of icon elements', function() {
      expect(getStars().length).toBe(10);
    });

    it('should change icon states', function() {
      expect(getState('on', 'off')).toEqual([true, true, true, true, true, false, false, false, false, false]);
    });
  });

  describe('Default title', function() {
    it('should return the default title for each star', function() {
      expect(getTitles()).toEqual(['one', 'two', 'three', 'four', 'five']);
    });
  });

  describe('shows different title when `max` attribute is greater than the titles array ', function() {
    var originalConfig = {};
    beforeEach(inject(function(ratingConfig) {
      $rootScope.rate = 5;
      angular.extend(originalConfig, ratingConfig);
      ratingConfig.max = 10;
      element = $compile('<rating ng-model="rate"></rating>')($rootScope);
      $rootScope.$digest();
    }));
    afterEach(inject(function(ratingConfig) {
      // return it to the original state
      angular.extend(ratingConfig, originalConfig);
    }));

   it('should return the default title for each star', function() {
      expect(getTitles()).toEqual(['one', 'two', 'three', 'four', 'five', '6', '7', '8', '9', '10']);
    });
  });

  describe('shows custom titles ', function() {
    it('should return the custom title for each star', function() {
      $rootScope.titles = [44,45,46];
      element = $compile('<rating ng-model="rate" titles="titles"></rating>')($rootScope);
      $rootScope.$digest();
      expect(getTitles()).toEqual(['44', '45', '46', '4', '5']);
    });
    it('should return the default title if the custom title is empty', function() {
      $rootScope.titles = [];
      element = $compile('<rating ng-model="rate" titles="titles"></rating>')($rootScope);
      $rootScope.$digest();
      expect(getTitles()).toEqual(['one', 'two', 'three', 'four', 'five']);
    });
   it('should return the default title if the custom title is not an array', function() {
      element = $compile('<rating ng-model="rate" titles="test"></rating>')($rootScope);
      $rootScope.$digest();
      expect(getTitles()).toEqual(['one', 'two', 'three', 'four', 'five']);
    });
  });
});
