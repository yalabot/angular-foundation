// jasmine matcher for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js
beforeEach(function() {
  jasmine.addMatchers({
    toHaveClass: function(util, customEqualityTesters) {

      function compare(actual, expected){
        var passed = actual.hasClass(expected);
        return {
          pass: passed,
          message: "Expected '" + actual + "'" + (passed ? ' not ' : ' ') + "to have class '" + expected + "'."
        };
      }

      return {compare: compare};
    },
    toBeHidden: function (util, customEqualityTesters) {

      function compare(actual, expected){
        var element = angular.element(actual);
        var passed = element.hasClass('ng-hide') || element.css('display') == 'none';
        return {
          pass: passed,
          message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equal ' + expected
        };
      }

      return {compare: compare};
    }
  });
});

window.matches = function(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
};
