angular.module("mm.foundation.offCanvas", [])
    .directive('offCanvasWrap', [function () {
        return {
            restrict: 'C',
            link: function ($scope, element, attrs) {
                // find the sidebar element and put it into the closure
                var sidebar = angular.element(document.querySelector(".off-canvas-wrap"));

                // find the .left-off-canvas-toggle and add a handler to add a .move-right class
                var left = angular.element(element[0].querySelector(".left-off-canvas-toggle"));
                left.on('click', function (e) {
                    e.preventDefault();
                    sidebar.addClass("move-right");
                });

                // find the .right-off-canvas-toggle and add a handler to add a .move-right class
                var right = angular.element(element[0].querySelector(".right-off-canvas-toggle"));
                right.on('click', function (e) {
                    e.preventDefault();
                    sidebar.addClass("move-left");
                });

                // finally find the .close button and add a handler to remove the .move-left and .move-right classes
                var hide = angular.element(element[0].querySelector(".exit-off-canvas"));
                hide.on('click', function (e) {
                    e.preventDefault();
                    sidebar.removeClass('move-left');
                    sidebar.removeClass('move-right');
                });
            }
        };
    }]);
