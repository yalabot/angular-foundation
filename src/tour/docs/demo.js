angular.module('foundationDemoApp').controller('TourDemoCtrl', function ($scope, $tour) {
  $scope.startTour = $tour.start;
});
