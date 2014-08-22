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
  }
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

          var offsetTop = offset.top - parentOffset.top + offset.height + 'px';
          var dropdownWidth = dropdown.prop('offsetWidth');

          if (controller.small()) {
            var offsetLeft = Math.max((parentOffset.width - dropdownWidth) / 2, 8);
            dropdown.css({
              position: 'absolute',
              width: '95%',
              'max-width': 'none',
              top: offsetTop,
              left: offsetLeft + 'px'
            });
          }
          else {
            var offsetLeft = Math.round(offset.left - parentOffset.left);
            var rightThreshold = $window.innerWidth - dropdownWidth - 8;
            if (offsetLeft > rightThreshold) {
                offsetLeft = rightThreshold;
                dropdown.removeClass('left').addClass('right');
            }
            dropdown.css({
              position: null,
              'max-width': null,
              left: offsetLeft + 'px',
              top: offsetTop
            });
          }

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
