describe('dropdownToggle', function() {
  var $compile, $rootScope, $document, element, menuElement;

  beforeEach(module('mm.foundation.dropdown'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
  }));

  var clickDropdownToggle = function(elm) {
    elm = elm || element;
    elm.find('a').click();
  };

  var findMenu = function(elm) {
    return elm.find('ul');
  };

  var triggerKeyDown = function (element, keyCode) {
    var e = $.Event('keydown');
    e.which = keyCode;
    element.trigger(e);
  };

  describe('basic', function() {
    function dropdown() {
      return $compile('<li dropdown><a dropdown-toggle></a><ul dropdown-menu><li>Hello</li></ul></li>')($rootScope);
    }

    beforeEach(function() {
      element = dropdown();
      menuElement = findMenu(element);
    });

    it('should toggle on `a` click', function() {
      expect(menuElement.hasClass('open')).toBe(false);
      clickDropdownToggle();
      expect(menuElement.hasClass('open')).toBe(true);
      clickDropdownToggle();
      expect(menuElement.hasClass('open')).toBe(false);
    });

    it('should close on document click', function() {
      clickDropdownToggle();
      expect(menuElement.hasClass('open')).toBe(true);
      $document.click();
      expect(menuElement.hasClass('open')).toBe(false);
    });

    it('should close on escape key', function() {
      clickDropdownToggle();
      triggerKeyDown($document, 27);
      expect(menuElement.hasClass('open')).toBe(false);
    });

    it('should not close on backspace key', function() {
      clickDropdownToggle();
      triggerKeyDown($document, 8);
      expect(menuElement.hasClass('open')).toBe(true);
    });

    it('should close on $location change', function() {
      clickDropdownToggle();
      expect(menuElement.hasClass('open')).toBe(true);
      $rootScope.$broadcast('$locationChangeSuccess');
      $rootScope.$apply();
      expect(menuElement.hasClass('open')).toBe(false);
    });

    it('should only allow one dropdown to be open at once', function() {
      var elm1 = dropdown();
      var menuElm1 = findMenu(elm1);
      var elm2 = dropdown();
      var menuElm2 = findMenu(elm2);


      expect(menuElm1.hasClass('open')).toBe(false);
      expect(menuElm2.hasClass('open')).toBe(false);

      clickDropdownToggle( elm1 );
      expect(menuElm1.hasClass('open')).toBe(true);
      expect(menuElm2.hasClass('open')).toBe(false);

      clickDropdownToggle( elm2 );
      expect(menuElm1.hasClass('open')).toBe(false);
      expect(menuElm2.hasClass('open')).toBe(true);
    });

    it('should not toggle if the element has `disabled` class', function() {
      var elm = $compile('<li class="dropdown"><a class="disabled" dropdown-toggle></a><ul><li>Hello</li></ul></li>')($rootScope);
      clickDropdownToggle( elm );
      expect(findMenu(elm).hasClass('open')).toBe(false);
    });

    it('should not toggle if the element is disabled', function() {
      var elm = $compile('<li class="dropdown"><button disabled="disabled" dropdown-toggle></button><ul><li>Hello</li></ul></li>')($rootScope);
      elm.find('button').click();
      expect(findMenu(elm).hasClass('open')).toBe(false);
    });

    // issue 270
    it('executes other document click events normally', function() {
      var checkboxEl = $compile('<input type="checkbox" ng-click="clicked = true" />')($rootScope);
      $rootScope.$digest();

      expect(menuElement.hasClass('open')).toBe(false);
      expect($rootScope.clicked).toBeFalsy();

      clickDropdownToggle();
      expect(menuElement.hasClass('open')).toBe(true);
      expect($rootScope.clicked).toBeFalsy();

      checkboxEl.click();
      expect($rootScope.clicked).toBeTruthy();
    });
  });

  describe('without trigger', function() {
    beforeEach(function() {
      $rootScope.isopen = true;
      element = $compile('<li dropdown is-open="isopen"><ul dropdown-menu><li>Hello</li></ul></li>')($rootScope);
      menuElement = findMenu(element);
      $rootScope.$digest();
    });

    it('should be open initially', function() {
      expect(menuElement.hasClass('open')).toBe(true);
    });

    it('should toggle when `is-open` changes', function() {
      $rootScope.isopen = false;
      $rootScope.$digest();
      expect(menuElement.hasClass('open')).toBe(false);
    });
  });

  describe('menu positioning', function() {
    beforeEach(function() {
      $rootScope.isopen = true;
      element = $compile('<li dropdown is-open="isopen"><a dropdown-toggle></a><ul dropdown-menu><li>Hello</li></ul></li>')($rootScope);
      menuElement = findMenu(element);
      document.body.appendChild(element[0]);  // To test offsetParent logic
      $rootScope.$digest();
    });

    afterEach(function() {
      document.body.removeChild(element[0]);
    });

    it('should have a position when open', function() {
      var leftPos = menuElement.css('left');
      var topPos = menuElement.css('top');
      // Pixel-based position
      expect(leftPos).toMatch(/px$/);
      expect(topPos).toMatch(/px$/);
      // That's not negative
      expect(leftPos).toMatch(/^[^\-]/);
      expect(topPos).toMatch(/^[^\-]/);
    });

    it('should be off-screen when closed', function() {
      $rootScope.isopen = false;
      $rootScope.$digest();
      var leftPos = menuElement.css('left');
      expect(leftPos).toMatch(/^-/);  // Should be negative
    });
  });

  describe('`is-open`', function() {
    beforeEach(function() {
      $rootScope.isopen = true;
      element = $compile('<li dropdown is-open="isopen"><a dropdown-toggle></a><ul dropdown-menu><li>Hello</li></ul></li>')($rootScope);
      menuElement = findMenu(element);
      $rootScope.$digest();
    });

    it('should be open initially', function() {
      expect(menuElement.hasClass('open')).toBe(true);
    });

    it('should change `is-open` binding when toggles', function() {
      clickDropdownToggle();
      expect($rootScope.isopen).toBe(false);
    });

    it('should toggle when `is-open` changes', function() {
      $rootScope.isopen = false;
      $rootScope.$digest();
      expect(menuElement.hasClass('open')).toBe(false);
    });
  });

  describe('`on-toggle`', function() {
    beforeEach(function() {
      $rootScope.toggleHandler = jasmine.createSpy('toggleHandler');
      element = $compile('<li class="dropdown" on-toggle="toggleHandler(open)"><a dropdown-toggle></a><ul dropdown-menu><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();
    });

    it('should be called initially', function() {
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(false);
    });

    it('should call it correctly when toggles', function() {
      clickDropdownToggle();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(true);

      clickDropdownToggle();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(false);
    });
  });

  describe('`on-toggle` with initially open', function() {
    beforeEach(function() {
      $rootScope.toggleHandler = jasmine.createSpy('toggleHandler');
      $rootScope.isopen = true;
      element = $compile('<li class="dropdown" on-toggle="toggleHandler(open)" is-open="isopen"><a dropdown-toggle></a><ul dropdown-menu><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();
    });

    it('should be called initially with true', function() {
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(true);
    });

    it('should call it correctly when toggles', function() {
      $rootScope.isopen = false;
      $rootScope.$digest();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(false);

      $rootScope.isopen = true;
      $rootScope.$digest();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(true);
    });
  });

  describe('missing directives', function() {
    it('should not crash when `dropdownToggle` has no parent `dropdown`', function() {
      $compile('<a dropdown-toggle></a>')($rootScope);
    });

    it('should not crash when `dropdownMenu` has no parent `dropdown`', function() {
      $compile('<ul class="dropdown-menu"></ul>')($rootScope);
    });

    it('should not crash when `dropdownMenu` is missing', function() {
      $rootScope.isopen = true;
      element = $compile('<li dropdown is-open="isopen"></li>')($rootScope);
      $rootScope.$digest();
    });
  });
});
