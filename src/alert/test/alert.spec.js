describe("alert", function () {

  var scope, $compile;
  var element;

  beforeEach(module('mm.foundation.alert'));
  beforeEach(module('template/alert/alert.html'));

  beforeEach(inject(function ($rootScope, _$compile_, $controller) {

    scope = $rootScope;
    $compile = _$compile_;

    element = angular.element(
        "<div>" + 
          "<alert ng-repeat='alert in alerts' type='alert.type'" +
            "close='removeAlert($index)'>{{alert.msg}}" +
          "</alert>" +
        "</div>");

    scope.alerts = [
      { msg:'foo', type:'success'},
      { msg:'bar', type:'warning round'},
      { msg:'baz', type:'info radius'},
      { msg:'qux'}
    ];
  }));

  function createAlerts() {
    $compile(element)(scope);
    scope.$digest();
    return element.find('.alert-box');
  }

  function findCloseButton(index) {
    return element.find('.close').eq(index);
  }

  function findContent(index) {
    return element.find('div > span').eq(index);
  }

  it("should generate alerts using ng-repeat", function () {
    var alerts = createAlerts();
    expect(alerts.length).toEqual(4);
  });

  it("should use correct classes for different alert types", function () {
    var alerts = createAlerts();
    expect(alerts.eq(0).is('.alert-box.success')).toBe(true);
    expect(alerts.eq(1).is('.alert-box.warning.round')).toBe(true);
    expect(alerts.eq(2).is('.alert-box.info.radius')).toBe(true);
    expect(alerts.eq(3).is('.alert-box')).toBe(true);
  });

  it('should show the alert content', function() {
    var alerts = createAlerts();

    for (var i = 0, n = alerts.length; i < n; i++) {
      expect(findContent(i).text()).toBe(scope.alerts[i].msg);
    }
  });

  it("should show close buttons", function () {
    var alerts = createAlerts();

    for (var i = 0, n = alerts.length; i < n; i++) {
      expect(findCloseButton(i).css('display')).not.toBe('none');
    }
  });

  it("should fire callback when closed", function () {

    var alerts = createAlerts();

    scope.$apply(function () {
      scope.removeAlert = jasmine.createSpy();
    });

    expect(findCloseButton(0).css('display')).not.toBe('none');
    findCloseButton(1).click();

    expect(scope.removeAlert).toHaveBeenCalledWith(1);
  });

  it('should not show close buttons if no close callback specified', function () {
    element = $compile('<alert>No close</alert>')(scope);
    scope.$digest();
    expect(findCloseButton(0)).toBeHidden();
  });

  it('should be possible to add additional classes for alert', function () {
    var element = $compile('<alert class="alert-block" type="\'info\'">Default alert!</alert>')(scope);
    scope.$digest();
    expect(element).toHaveClass('alert-block');
    expect(element).toHaveClass('info');
  });

});
