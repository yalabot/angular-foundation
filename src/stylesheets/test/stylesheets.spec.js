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
    var sheet = stylesheetFactory();
    sheet.css('#id:before', {color:'red'});
    sheet.element().attr('id', sheetId);

    var $sheet = $document.find('#' + sheetId);
    expect($sheet.text()).toEqual(sheet.element().text());
  });
});

