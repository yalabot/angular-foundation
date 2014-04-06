describe('offcanvas directive', function () {
  var $rootScope, element;
  beforeEach(module('mm.foundation.offcanvas'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.value = 22;
    element = $compile(
      '<div class="off-canvas-wrap">' +
        '<div class="inner-wrap">' +
          '<nav class="tab-bar">' +
            '<section class="left-small">' +
              '<a class="left-off-canvas-toggle menu-icon"><span></span></a>' +
            '</section>' +
            '<section class="middle tab-bar-section">' +
              '<h1 class="title">OffCanvas</h1>' +
            '</section>' +
            '<section class="right-small">' +
              '<a class="right-off-canvas-toggle menu-icon"><span></span></a>' +
            '</section>' +
          '</nav>' +
          '<aside class="left-off-canvas-menu">' +
            '<ul class="off-canvas-list">' +
              '<li><a href="#">Left Sidebar</a></li>' +
            '</ul>' +
          '</aside>' +
          '<aside class="right-off-canvas-menu">' +
            '<ul class="off-canvas-list">' +
              '<li><a href="#">Right Sidebar</a></li>' +
            '</ul>' +
          '</aside>' +
          '<section class="main-section">' +
            '<div>The quick brown fox.</div>' +
          '</section>' +
          '<a class="exit-off-canvas"></a>' +
        '</div>' +
      '</div>')($rootScope);
    $rootScope.$digest();
  }));

  beforeEach(inject(function ($rootScope) {
    this.addMatchers({
      leftOpen: function() {
        return  this.actual.hasClass('move-right');
      },
      rightOpen: function() {
        return this.actual.hasClass('move-left');
      },
      isClosed: function() {
        return !this.actual.hasClass('move-left') &&
            !this.actual.hasClass('move-right');
      }
    });
  }));


  it('has left aside open on click', function() {
    $('.left-off-canvas-toggle', element).trigger('click');
    expect(element).leftOpen();
  });

  it('has right aside open on click', function() {
    $('.right-off-canvas-toggle', element).trigger('click');
    expect(element).rightOpen();
  });

  it('is closes after clicking on the overlay', function() {
    $('.right-off-canvas-toggle', element).trigger('click');
    expect(element).rightOpen();
    $('.exit-off-canvas', element).trigger('click');
    expect(element).isClosed();
  });

  it('is closes after clicking on a list item', function() {
    $('.right-off-canvas-toggle', element).trigger('click');
    expect(element).rightOpen();
    $('.off-canvas-list', element).trigger('click');
    expect(element).isClosed();
  });

});
