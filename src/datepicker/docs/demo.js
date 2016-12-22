angular.module('foundationDemoApp').controller('DatepickerDemoCtrl', function ($scope, $modal, $log) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();


  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalDatepicker.html',
      controller: 'ModalInstanceDatePickerCtrl',
      resolve: {
        dt: function () {
          return $scope.dt;
        }
      }
    });

    modalInstance.result.then(function (dt) {
      $scope.dt = dt;
    }, function () {
      $log.info('Modal dismissed at: ' + $scope.dt);
    });
  };

  //$scope.closePicker = function () {
  //  //$scope.dt = date;
  //  console.log("Close moi!");
  //
  //};

});

angular.module('foundationDemoApp').controller('ModalInstanceDatePickerCtrl', function ($scope, $modalInstance, dt) {

  $scope.dt = dt;

  $scope.ok = function () {
    $modalInstance.close(this.dt);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
