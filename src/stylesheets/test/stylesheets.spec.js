describe('stylesheets', function() {
  var $compile, $rootScope, $document, stylesheetFactory;

  beforeEach(module('mm.foundation.stylesheets'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _stylesheetFactory_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    stylesheetFactory = _stylesheetFactory_;
    $scope = $rootScope.$new();
  }));

  var cssEquals = function(sheet, expected) {
    var el = sheet.element();
    var _sheet = $document[0].querySelector('#' + el.id);
    expect(_sheet.textContent).toEqual(expected);
    expect(el.textContent).toEqual(expected);
  };

  it('should create and inject new stylesheet', function() {
    var sheetId = 'stylesheets-test';
    var selector = '#id::before';
    var prop = 'color';
    var value = 'red';

    var content = {};
    content[prop] = value;

    var sheet = stylesheetFactory();
    sheet.element().id = sheetId;

    sheet.css(selector, content).sync();
    cssEquals(sheet, '#id::before {\n\tcolor: red;\n}');

    content[prop] = 'green';
    sheet.css(selector, content).sync();
    cssEquals(sheet, '#id::before {\n\tcolor: green;\n}');
  });

  it('should detach when syncing empty sheet', function() {
    var sheetId = 'stylesheets-empty';

    var $style = angular.element($document[0].createElement('style'));
    $style.attr('id', sheetId);
    $style.text('body{color:green;}');
    angular.element($document[0].querySelector('head')).append($style);

    var sheet = stylesheetFactory($style[0]);
    sheet.css('body', null).sync();

    // Test if sheet is removed from dom
    var sheet = $document[0].querySelector('#' + sheetId);
    expect(sheet).toEqual(null);
  });
});
