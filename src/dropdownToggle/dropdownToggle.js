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
          dropdown.addClass('f-open-dropdown');

          var options = element.attr('data-options') ? element.attr('data-options').split(';') : [];
          var align = null;

          for (var i = 0; i < options.length; i++) {
            var split = options[i].split(':');
            if (split[0] === 'align') {
              align = split[1];
            }
          }
          var offset = $position.offset(element);
          var parentOffset = $position.offset(angular.element(dropdown[0].offsetParent));
          var dropdownWidth = dropdown.prop('offsetWidth');
          var dropdownHeight = dropdown.prop('offsetHeight');
          var top = offset.top - parentOffset.top + offset.height;

          switch (align) {
            case 'top-left':
              top -= dropdownHeight / 2;
              break;
          }

          var css = {
            top: top + 'px'
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
            switch (align) {
              case 'left':
                left -= dropdownWidth;
                break;
              case 'top-left':
                left -= dropdownWidth;
                break;
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
            dropdown.removeClass('f-open-dropdown');
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
