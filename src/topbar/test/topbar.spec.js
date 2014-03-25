describe('topbar directive', function () {
  var $rootScope, element, $document;

  var setMobile = function(windowMock){
    windowMock.matchMedia.andReturn({matches: false});
  };

  var setDesktop = function(windowMock){
    windowMock.matchMedia.andReturn({matches: true});
  };

  beforeEach(module('mm.foundation.topbar', function($provide){
    window.matchMedia = jasmine.createSpy('matchMedia');
    $provide.value('$window', window);
    $provide.value('$document', angular.element(document));
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;

    $rootScope.settings = {
        sticky_class : 'sticky',
        custom_back_text: true,
        back_text: 'Back',
        is_hover: true,
        mobile_show_parent_link: true,
        scrolltop : false,
        sticky_on : 'all'
    };
    element = $compile(
          '<body>' +
            '<div class="fixed" id="container">' +
              '<nav class="top-bar" options="settings">' +
                '<ul class="title-area">' + 
                  '<li class="name">' + 
                    '<h1><a href="#">My Site</a></h1>' + 
                  '</li>' + 
                  '<li id="menu-toggle" class="toggle-topbar menu-icon">' +
                    '<a href="#">Menu</a>' +
                  '</li>' +
                '</ul>' +
                '<section class="top-bar-section">' +
                    '<ul class="right">' +
                      '<li class="active">' +
                        '<a href="#">Active</a>' +
                      '</li>' +
                      '<li class="has-dropdown">' +
                        '<a id="dropdown" href="#">Dropdown</a>' +
                        '<ul class="dropdown">' +
                          '<li><a id="alink" href="#">First link in dropdown</a></li>' +
                        '</ul>' +
                      '</li>' +
                    '</ul>' +
                    '<ul class="left">' +
                      '<li><a href="#">Left</a></li>' +
                    '</ul>' +
                '</section>' +
              '</nav>' +
              '<div>Content</div>' +
            '</div>' +
          '</body>')($rootScope);
    $('body', $document).append(element);
    $rootScope.$digest();
  }));

  beforeEach(inject(function ($rootScope) {
    this.addMatchers({
      toHaveDropDownsOpen: function(noOfLevels) {
        var dropDownDomEls = this.actual.find('li.has-dropdown.not-click');
        return dropDownDomEls.length === noOfLevels;
      },
      toHaveMobileMenuOpen: function() {
        var els = this.actual.find('nav.top-bar.expanded');
        return !!els.length;
      },
    });
  }));

  it('has a "top-bar" css class', function() {
    expect(element.children('nav')).toHaveClass('top-bar');
  });

  it('has a drop down open on large screen', inject(function($window) {
    setDesktop($window);
    $('#dropdown', element).trigger('mouseenter');
    expect($window.matchMedia).toHaveBeenCalled();
    expect(element).toHaveDropDownsOpen(1);
  }));

  it('has no drop downs open on small screen', inject(function($window) {
    setMobile($window);
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
    setMobile($window);
    $('#menu-toggle', element).trigger('click');
    expect($window.matchMedia).toHaveBeenCalled();
    expect(element).toHaveMobileMenuOpen();
    $('#menu-toggle', element).trigger('click');
    expect(element).not.toHaveMobileMenuOpen();
  }));

  it('has f-topbar-fixed class on body after link is clicked on a fixed mobile topbar', inject(function($window) {
    setMobile($window);
    $('#menu-toggle', element).trigger('click');
    expect($window.matchMedia).toHaveBeenCalled();
    $('#dropdown', element).trigger('click');
    $('#alink', element).trigger('click');
    expect($('body', $document)).toHaveClass('f-topbar-fixed');
  }));

});
