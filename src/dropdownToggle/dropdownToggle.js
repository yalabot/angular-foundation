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
    controller: 'DropdownToggleController',
    link: function(scope, element, attrs, controller) {
      var parent = element.parent(),
          dropdown = angular.element($document[0].querySelector(attrs.dropdownToggle));

      var parentHasDropdown = function() {
        return parent.hasClass('has-dropdown');
      };

      var onClick = function (event) {
        dropdown = angular.element($document[0].querySelector(attrs.dropdownToggle));
        var elementWasOpen = (element === openElement);

        event.preventDefault();
        event.stopPropagation();

        if (!!openElement) {
          closeMenu();
        }

        if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
          dropdown.css('display', 'block'); // We display the element so that offsetParent is populated
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
                left = left - dropdownWidth + $position.position(element).width;
                dropdown.removeClass('left').addClass('right');
            }
            css.left = left + 'px';
            css.position = null;
            css['max-width'] = null;
          }

          dropdown.css(css);
          element.addClass('expanded');

          if (parentHasDropdown()) {
            parent.addClass('hover');
          }

          openElement = element;

          closeMenu = function (event) {
            $document.off('click', closeMenu);
            dropdown.css('display', 'none');
            element.removeClass('expanded');
            closeMenu = angular.noop;
            openElement = null;
            if (parent.hasClass('hover')) {
              parent.removeClass('hover');
            }
          };
          $document.on('click', closeMenu);

          repositionMenu = function() {
            if (!!openElement) {
              var left = $position.position(element).left;
              if (dropdown.hasClass('right')) {
                left = left - dropdownWidth + $position.position(element).width;
              }
              dropdown.css('left', left);
            }
          };
          angular.element($window).on('resize', repositionMenu);
        }
      };

      if (dropdown) {
        dropdown.css('display', 'none');
      }

      scope.$watch('$location.path', function() { closeMenu(); });

      element.on('click', onClick);
      element.on('$destroy', function(resizeMenu) {
        element.off('click', onClick);
        $window.removeEventListener('resize', resizeMenu);
      });
    }
  };
}]);
