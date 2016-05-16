describe('topbar directive', function() {
  var $rootScope, $document, $compile, $window, element, containerElement;

  beforeEach(function() {
    $window = angular.extend(window, {
      pageYOffset: 0,
      scrollTo: jasmine.createSpy('scrollTo'),
      matchMedia: jasmine.createSpy('matchMedia').andReturn({matches: false}),
    });

    module(
      'mm.foundation.topbar',
      'template/topbar/top-bar.html',
      'template/topbar/has-dropdown.html',
      'template/topbar/toggle-top-bar.html',
      'template/topbar/top-bar-section.html',
      'template/topbar/top-bar-dropdown.html',
      {$window: $window});

    inject(function(_$compile_, _$rootScope_, _$document_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $document = _$document_;
    });
  });

  beforeEach(inject(function ($rootScope) {
    this.addMatchers({
      toHaveDropDownsOpen: function(noOfLevels) {
        var dropDownDomEls = element.find('li.has-dropdown.not-click');
        return dropDownDomEls.length === noOfLevels;
      },
      toHaveMobileMenuOpen: function() {
        return element.hasClass("expanded");
      }
    });
  }));

  var setMobile = function() {
    $window.matchMedia.andReturn({matches: false});
  };

  var setDesktop = function() {
    $window.matchMedia.andReturn({matches: true});
  };

  var compileDirective = function(markup) {
    if (angular.isUndefined(markup)) {
      markup =
        '<div class="fixed" id="container">' +
          '<top-bar scrolltop="false">' +
            '<ul class="title-area">' +
              '<li class="name">' +
                '<h1><a href="#">My Site</a></h1>' +
              '</li>' +
              '<li toggle-top-bar id="menu-toggle" class="menu-icon">' +
                '<a href="#">Menu</a>' +
              '</li>' +
            '</ul>' +
            '<top-bar-section id="top-section">' +
              '<ul class="right">' +
                '<li class="active">' +
                  '<a href="#">Active</a>' +
                '</li>' +
                '<li has-dropdown>' +
                  '<a id="dropdown" href="#">Dropdown</a>' +
                  '<ul top-bar-dropdown>' +
                    '<li><a id="alink" href="#">First link in dropdown</a></li>' +
                  '</ul>' +
                '</li>' +
              '</ul>' +
              '<ul class="left">' +
                '<li><a href="#">Left</a></li>' +
              '</ul>' +
            '</top-bar-section>' +
          '</top-bar>' +
          '<div>Content</div>' +
        '</div>';
    }

    containerElement = $compile(markup)($rootScope);
    $('body', $document).append(element);
    $rootScope.$digest();
    element = containerElement.find("nav");
  };

  describe("basic behavior", function() {
    beforeEach(function() {
      compileDirective();
    });

    it('has a "top-bar" css class', function() {
      expect(element).toHaveClass('top-bar');
    });

    it('has a drop down open on large screen', inject(function($window) {
      setDesktop();
      $('#dropdown', element).trigger('mouseenter');
      expect($window.matchMedia).toHaveBeenCalled();
      expect(element).toHaveDropDownsOpen(1);
    }));

    it('has no drop downs open on small screen', inject(function($window) {
      setMobile();
      $('#dropdown', element).trigger('mouseenter');
      expect($window.matchMedia).toHaveBeenCalled();
      expect(element).toHaveDropDownsOpen(0);
    }));

    it('has no mobile menu opening on large screen', inject(function($window) {
      setDesktop($window);
      $('#menu-toggle', element).trigger('click');
      expect($window.matchMedia).toHaveBeenCalled();
      expect(element).not.toHaveMobileMenuOpen();
    }));

    it('opens and closes mobile menu on small screen', inject(function($window) {
      setMobile();
      $('#menu-toggle', element).trigger('click');
      expect($window.matchMedia).toHaveBeenCalled();
      expect(element).toHaveMobileMenuOpen();
      $('#menu-toggle', element).trigger('click');
      expect(element).not.toHaveMobileMenuOpen();
    }));

    it('opens the submenu when a dropdown is clicked on mobile', inject(function($window) {
      var topSection = element.find('#top-section');
      var menuToggle = element.find('#menu-toggle');
      setMobile();
      expect(element.hasClass("expanded")).toBe(false);
      menuToggle.trigger('click');
      expect($window.matchMedia).toHaveBeenCalled();
      expect(element.hasClass("expanded")).toBe(true);
    }));
  });

  describe("sticky", function() {
    var markup;

    beforeEach(function() {
      markup =
        '<div class="sticky">' +
          '<top-bar>' +
            '<ul class="title-area">' +
              '<li class="name">' +
                '<h1><a href="#">My Site</a></h1>' +
              '</li>' +
              '<li toggle-top-bar id="menu-toggle" class="menu-icon">' +
                '<a href="#">Menu</a>' +
              '</li>' +
            '</ul>' +
          '</top-bar>' +
        '</div>';
    });

    it('does not apply the fixed class on initial load', function() {
      compileDirective(markup);
      expect(containerElement.hasClass('fixed')).toBe(false);
    });
  });
});
