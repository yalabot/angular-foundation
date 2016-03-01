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
    jasmine.addMatchers({
      leftOpen: function(util, customEqualityTesters) {
        function compare(actual){
          return {
            pass: actual.hasClass('move-right'),
          };
        }
        return {compare: compare};
      },
      rightOpen: function(util, customEqualityTesters) {
        function compare(actual){
          return {
            pass: actual.hasClass('move-left'),
          };
        }
        return {compare: compare};
      },
      isClosed: function(util, customEqualityTesters) {
        function compare(actual){
          return {
            pass: !actual.hasClass('move-left') &&
            !actual.hasClass('move-right'),
          };
        }
        return {compare: compare};
      }
    });
  }));


  it('has left aside open on click', function() {
    element[0].querySelector('.left-off-canvas-toggle').click();
    expect(element).leftOpen();
  });

  it('has right aside open on click', function() {
    element[0].querySelector('.right-off-canvas-toggle').click();
    expect(element).rightOpen();
  });

  it('is closes after clicking on the overlay', function() {
    element[0].querySelector('.right-off-canvas-toggle').click();
    expect(element).rightOpen();
    element[0].querySelector('.exit-off-canvas').click();
    expect(element).isClosed();
  });

  it('is closes after clicking on a list item', function() {
    element[0].querySelector('.right-off-canvas-toggle').click();
    expect(element).rightOpen();
    element[0].querySelector('.off-canvas-list').click();
    expect(element).isClosed();
  });

});
