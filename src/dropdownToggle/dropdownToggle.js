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

.directive('dropdownToggle', ['$document', '$location', '$position', 'mediaQueries', function ($document, $location, $position, mediaQueries) {
  var openElement = null,
      closeMenu   = angular.noop;
  return {
    restrict: 'CA',
    scope: {
      dropdownToggle: '@'
    },
    link: function(scope, element, attrs) {
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

          if (mediaQueries.small() && !mediaQueries.medium()) {
            var dropdownWidth = dropdown.prop('offsetWidth');
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
            dropdown.css({
              position: null,
              'max-width': null,
              left: offset.left - parentOffset.left + 'px',
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
