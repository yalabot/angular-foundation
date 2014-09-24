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

  it('should create and inject new stylesheet', function() {
    var sheetId = 'stylesheets-test';
    var selector = '#id::before';
    var prop = 'color';
    var value = 'red';

    var content = {};
    content[prop] = value;

    var sheet = stylesheetFactory();
    sheet.element().attr('id', sheetId);

    var cssEquals = function(expected) {
      var $sheet = $document.find('#' + sheetId);
      expect($sheet.text()).toEqual(expected);
      expect(sheet.element().text()).toEqual(expected);
    };

    sheet.css(selector, content).sync();
    cssEquals('#id::before {\n\tcolor: red;\n}');

    content[prop] = 'green';
    sheet.css(selector, content).sync();
    cssEquals('#id::before {\n\tcolor: green;\n}');

    sheet.css(selector, null).sync();
    cssEquals('');
  });
});
