/*
 * dropdownToggle - Provides dropdown menu functionality
 * @restrict class or attribute
 * @example:

   <a dropdown-toggle="#dropdown-menu">My Dropdown Menu</a>
   <ul id="dropdown-menu" class="f-dropdown">
     <li ng-repeat="choice in dropChoices">
       <a ng-href="{{choice.href}}">{{choice.text}}</a>
     </li>
   </ul>
 */
angular.module('mm.foundation.dropdownToggle', [ 'mm.foundation.position', 'mm.foundation.mediaQueries' ])

.controller('DropdownToggleController', ['$scope', '$attrs', 'mediaQueries', function($scope, $attrs, mediaQueries) {
  this.small = function() {
    return mediaQueries.small() && !mediaQueries.medium();
  };
}])

.directive('dropdownToggle', ['$document', '$window', '$location', '$position', function ($document, $window, $location, $position) {
  var openElement = null,
      closeMenu   = angular.noop;
  return {
    restrict: 'CA',
    scope: {
      dropdownToggle: '@'
    },
    controller: 'DropdownToggleController',
    link: function(scope, element, attrs, controller) {
      var dropdown = angular.element($document[0].querySelector(scope.dropdownToggle));

      scope.$watch('$location.path', function() { closeMenu(); });
      element.bind('click', function (event) {
        dropdown = angular.element($document[0].querySelector(scope.dropdownToggle));
        var elementWasOpen = (element === openElement);

        event.preventDefault();
        event.stopPropagation();

        if (!!openElement) {
          closeMenu();
        }

        if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
          dropdown.css('display', 'block');

          var offset = $position.offset(element);
          var parentOffset = $position.offset(angular.element(dropdown[0].offsetParent));

          var dropdownWidth = dropdown.prop('offsetWidth');

          var css = {
              top: offset.top - parentOffset.top + offset.height + 'px'
          };

          if (controller.small()) {
            css.left = Math.max((parentOffset.width - dropdownWidth) / 2, 8) + 'px';
            css.position = 'absolute';
            css.width = '95%';
            css['max-width'] = 'none';
          }
          else {
            var left = Math.round(offset.left - parentOffset.left);
            var rightThreshold = $window.innerWidth - dropdownWidth - 8;
            if (left > rightThreshold) {
                left = rightThreshold;
                dropdown.removeClass('left').addClass('right');
            }
            css.left = left + 'px';
            css.position = null;
            css['max-width'] = null;
          }

          dropdown.css(css);

          openElement = element;
          closeMenu = function (event) {
            $document.unbind('click', closeMenu);
            dropdown.css('display', 'none');
            closeMenu = angular.noop;
            openElement = null;
          };
          $document.bind('click', closeMenu);
        }
      });

      if (dropdown) {
        dropdown.css('display', 'none');
      }
    }
  };
}]);
