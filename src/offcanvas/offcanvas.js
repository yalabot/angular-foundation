angular.module("mm.foundation.offcanvas", [])
    .directive('offCanvasWrap', ['$window', function ($window) {
        return {
            scope: {},
            restrict: 'C',
            link: function ($scope, element, attrs) {
                var win = angular.element($window);
                var sidebar = $scope.sidebar = element;

                $scope.hide = function () {
                    sidebar.removeClass('move-left');
                    sidebar.removeClass('move-right');
                };

                win.bind("resize.body", $scope.hide);

                $scope.$on('$destroy', function() {
                    win.unbind("resize.body", $scope.hide);
                });

            },
            controller: ['$scope', function($scope) {

                this.leftToggle = function() {
                    $scope.sidebar.toggleClass("move-right");
                };

                this.rightToggle = function() {
                    $scope.sidebar.toggleClass("move-left");
                };

                this.hide = function() {
                    $scope.hide();
                };
            }]
        };
    }])
    .directive('leftOffCanvasToggle', [function () {
        return {
            require: '^offCanvasWrap',
            restrict: 'C',
            link: function ($scope, element, attrs, offCanvasWrap) {
                element.on('click', function () {
                    offCanvasWrap.leftToggle();
                });
            }
        };
    }])
    .directive('rightOffCanvasToggle', [function () {
        return {
            require: '^offCanvasWrap',
            restrict: 'C',
            link: function ($scope, element, attrs, offCanvasWrap) {
                element.on('click', function () {
                    offCanvasWrap.rightToggle();
                });
            }
        };
    }])
       .directive('exitOffCanvas', [function () {
        return {
            require: '^offCanvasWrap',
            restrict: 'C',
            link: function ($scope, element, attrs, offCanvasWrap) {
                element.on('click', function () {
                    offCanvasWrap.hide();
                });
            }
        };
    }])
    .directive('offCanvasList', [function () {
        return {
            require: '^offCanvasWrap',
            restrict: 'C',
            link: function ($scope, element, attrs, offCanvasWrap) {
                element.on('click', function () {
                    offCanvasWrap.hide();
                });
            }
        };
    }]);
