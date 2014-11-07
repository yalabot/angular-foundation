angular.module('foundationDemoApp').controller('ProgressDemoCtrl', function ($scope) {
  
  $scope.max = 200;

  $scope.random = function() {
    var value = Math.floor((Math.random() * 100) + 1);
    var type;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'alert';
    }

    $scope.showWarning = (type === 'alert' || type === 'warning');

    $scope.dynamic = value;
    $scope.type = type;
  };
  $scope.random();
});
