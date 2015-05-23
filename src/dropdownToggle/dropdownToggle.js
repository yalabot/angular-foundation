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
      var parent = element.parent();
      var dropdown = angular.element($document[0].querySelector(scope.dropdownToggle));

      var parentHasDropdown = function() {
        return parent.hasClass('has-dropdown');
      };

      var onClick = function (event) {
        dropdown = angular.element($document[0].querySelector(scope.dropdownToggle));
        var elementWasOpen = (element === openElement);

        event.preventDefault();
        event.stopPropagation();

        if (!!openElement) {
          closeMenu();
        }

        if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
          // Set default align to bottom
          var align = 'bottom';
          var position = 'absolute';
          var css = {};

          // Check data-options for alignment
          var options = element.attr('data-options') ? element.attr('data-options').split(';') : [];
          for (var i = 0; i < options.length; i++) {
            var split = options[i].split(':');
            if (split[0] == 'align') {
              align = split[1];
            }
            if (split[0].trim() == 'position') {
              position = split[1];
            }
          }

          // Override positioning in some cases (small device)
          if (controller.small()) {
            css.left = Math.max((parentOffset.width - dropdownWidth) / 2, 8) + 'px';
            css.position = 'absolute';
            css.width = '95%';
            css['max-width'] = 'none';
          }
          else {
            // Set position = fixed if dropdown is fixed via CSS
            if (dropdown.css('position') == 'fixed') {
              position = 'fixed';
            }

            // Get offsets
            dropdown.css('display', 'block'); // We display the element so that offsetParent is populated
            var offset = $position.offset(element);
            if (position != 'fixed') {
              var offsetParent = angular.element(dropdown[0].offsetParent);
            } else {
              // offsetParent doesn't always return body for some reason
              var offsetParent = $('body');
            }
            var parentOffset = $position.offset(offsetParent);
            var pipWidth = 8;
            var dropdownWidth = dropdown.prop('offsetWidth') + pipWidth; // (for drop left/right)
            var dropdownHeight = dropdown.prop('offsetHeight') + pipWidth; // (for drop top/bottom)

            // Set css dependent on alignment
            var done = false;
            var tries = 0;
            while (!done && tries < 2) {
              tries++;
              // Start from target element's top left and adjust from there
              if (position != 'fixed') {
                css.top = offset.top - parentOffset.top;
                css.left = offset.left - parentOffset.left;
              } else {
                // this isn't exactly right ...
                css.top = parentOffset.top;
                css.left = offset.left;
              }
              switch (align) {
                case 'top':
                  css.top -= dropdownHeight;
                  if (css.top < 0) {
                    align = 'bottom';
                  } else {
                    done = true;
                  }
                  break;

                case 'left':
                  css.left -= dropdownWidth;
                  if (css.left < 0) {
                    align = 'right';
                  } else {
                    done = true;
                  }
                  break;

                case 'right':
                  css.left += offset.width + pipWidth;
                  if (css.left + dropdownWidth > $window.innerWidth) {
                    align = 'left';
                  } else {
                    done = true;
                  }
                  break;

                case 'bottom':
                  css.top += offset.height + pipWidth;
                  if (css.top + dropdownHeight > $window.innerHeight) {
                    align = 'top';
                  } else {
                    done = true;
                  }
                  break;
              }
            }

            css.top = css.top + 'px';
            css.left = css.left + 'px';
            css.position = position;
            css['max-width'] = null;
          }

          var aligns = ['top', 'left', 'bottom', 'right'];
          aligns.forEach(function(el) {
            dropdown.removeClass('drop-' + el);
          });
          dropdown.addClass('drop-' + align);
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
        }
      };

      if (dropdown) {
        dropdown.css('display', 'none');
      }

      scope.$watch('$location.path', function() { closeMenu(); });

      element.on('click', onClick);
      element.on('$destroy', function() {
        element.off('click', onClick);
      });
    }
  };
}]);
