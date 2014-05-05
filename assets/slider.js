angular.module('sliderDemoApp', ['mm.foundation.fdnSlider'])
  .controller('sliderController', function($scope) {
    $scope.test = function() {
      alert("it worked");
    }
  });

