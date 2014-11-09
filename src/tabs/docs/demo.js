angular.module('foundationDemoApp').controller('TabsDemoCtrl', function ($scope) {
  $scope.tabs = [
    { title:"Dynamic Title 1", content:"Dynamic content 1" },
    { title:"Dynamic Title 2", content:"Dynamic content 2" }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      alert("You've selected the alert tab!");
    });
  };
});
