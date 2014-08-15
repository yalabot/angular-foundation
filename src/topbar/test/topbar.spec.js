describe('topbar directive', function () {
  var $rootScope, element, $document;

  var setMobile = function(windowMock){
    windowMock.matchMedia.andReturn({matches: false});
  };

  var setDesktop = function(windowMock){
    windowMock.matchMedia.andReturn({matches: true});
  };

  beforeEach(module('template/topbar/top-bar.html'));
  beforeEach(module('template/topbar/has-dropdown.html'));
  beforeEach(module('template/topbar/toggle-top-bar.html'));
  beforeEach(module('template/topbar/top-bar-section.html'));
  beforeEach(module('template/topbar/top-bar-dropdown.html'));

  beforeEach(module('mm.foundation.topbar', function($provide){
    window.matchMedia = jasmine.createSpy('matchMedia').andReturn({matches: false});
    $provide.value('$window', window);
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;

    element = $compile(
          '<body>' +
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
      }
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

  it('opens the submenu when a dropdown is clicked on mobile', inject(function($window) {
    setMobile($window);
    $('#menu-toggle', element).trigger('click');
    expect($window.matchMedia).toHaveBeenCalled();
    var beforeHeight = $('.top-bar', element)[0].style.height;
    $('#dropdown', element).trigger('click');
    var afterHeight = $('.top-bar', element)[0].style.height;
    expect(afterHeight).toNotEqual(beforeHeight);
    expect($('#top-section', element)[0].style.left).toEqual('-100%');
  }));

  // it('has f-topbar-fixed class on body after link is clicked on a fixed mobile topbar', inject(function($window) {
  //   setMobile($window);
  //   $('#menu-toggle', element).trigger('click');
  //   expect($window.matchMedia).toHaveBeenCalled();
  //   $('#dropdown', element).trigger('click');
  //   $('#alink', element).trigger('click');
  //   expect($('body', $document)).toHaveClass('f-topbar-fixed');
  // }));

});
