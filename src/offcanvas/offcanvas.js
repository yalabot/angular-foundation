angular.module("mm.foundation.offCanvas", [])
    .directive('offCanvasWrap', ['$window', function ($window) {
        return {
            restrict: 'C',
            link: function ($scope, element, attrs) {
            	var win = angular.element($window);
            	var sidebar = $scope.sidebar = element;

            	$scope.hide = function () {
		            sidebar.removeClass('move-left');
		            sidebar.removeClass('move-right');
		        }

		        win.bind("resize.body", $scope.hide);

            },
            controller: ['$scope', function($scope) {

	            this.leftToggle = function() {
	                if($scope.sidebar.hasClass("move-right"))
                    	$scope.sidebar.removeClass('move-right');
                    else
                    	$scope.sidebar.addClass("move-right");
	            }

	            this.rightToggle = function() {
	                if($scope.sidebar.hasClass("move-left"))
                    	$scope.sidebar.removeClass('move-left');
                    else
                    	$scope.sidebar.addClass("move-left");
	            }

	            this.hide = function() {
	                $scope.hide();
	            }
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
            	console.log(element);
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
            	console.log(element);
            	element.on('click', function () {
                    offCanvasWrap.hide();
                });
            }
        };
    }]);