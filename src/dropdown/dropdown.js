angular.module('mm.foundation.dropdown', [ 'mm.foundation.position' ])

.constant('dropdownConfig', {
  openClass: 'open',
  dropdownClass: 'f-dropdown'
})

/**
 * The purpose of dropdownService is to act as a global entity that
 * ensures that only one dropdown is opened at a time. It keeps track
 * of the currently opened dropdown and closes it when some other
 * dropdown is opened.
 */
.service('dropdownService', ['$document', function($document) {
  var self = this, openScope = null;

  this.open = function( dropdownScope ) {
    if ( !openScope ) {
      $document.bind('click', closeDropdown);
      $document.bind('keydown', escapeKeyBind);
    }

    if ( openScope && openScope !== dropdownScope ) {
        openScope.isOpen = false;
    }

    openScope = dropdownScope;
  };

  this.close = function( dropdownScope ) {
    if ( openScope === dropdownScope ) {
      openScope = null;
      $document.unbind('click', closeDropdown);
      $document.unbind('keydown', escapeKeyBind);
    }
  };

  var closeDropdown = function() {
    openScope.$apply(function() {
      openScope.isOpen = false;
    });
  };

  var escapeKeyBind = function( evt ) {
    if ( evt.which === 27 ) {  // Listen for escape keypress
      closeDropdown();
    }
  };
}])

.controller('DropdownController', ['$scope', '$attrs', '$position', 'dropdownConfig', 'dropdownService', function($scope, $attrs, $position, dropdownConfig, dropdownService) {
  var self = this, openClass = dropdownConfig.openClass;

  this.init = function( element ) {
    self.$element = element;
    $scope.isOpen = angular.isDefined($attrs.isOpen) ? $scope.$parent.$eval($attrs.isOpen) : false;
  };

  this.initToggle = function( element ) {
    self.$toggleElement = element;
  };

  this.initMenu = function( element ) {
    self.$menuElement = element;
  };

  this.toggle = function() {
    return $scope.isOpen = !$scope.isOpen;
  };

  $scope.$watch('isOpen', function( value ) {
    if (!self.$menuElement) {
      // No menu element; did you use the dropdownMenu directive?
      return;
    }

    self.$menuElement.toggleClass( openClass, value );

    if ( value ) {
      dropdownService.open( $scope );

      var offset = $position.offset(self.$toggleElement || self.$element);
      var offsetParent = self.$menuElement[0].offsetParent;
      var parentOffset = offsetParent ? $position.offset(angular.element(offsetParent)) : { left: 0, top: 0 };

      self.$menuElement.css({
        left: offset.left - parentOffset.left + 'px',
        top: offset.top - parentOffset.top + offset.height + 'px'
      });
    } else {
      dropdownService.close( $scope );

      // It would be elegant to just unset the left and top properties here
      // by setting them to the empty string. This doesn't work in IE8 though.
      self.$menuElement.css({
        left: '-9999px',
        top: '0'
      });
    }

    $scope.onToggle({ open: !!value });
  });

  $scope.$on('$locationChangeSuccess', function() {
    $scope.isOpen = false;
  });
}])

.directive('dropdown', function() {
  return {
    restrict: 'CA',
    controller: 'DropdownController',
    scope: {
      isOpen: '=?',
      onToggle: '&'
    },
    link: function(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init( element );
    }
  };
})

.directive('dropdownMenu', ['dropdownConfig', function(dropdownConfig) {
  return {
    restrict: 'CA',
    require: '?^dropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if ( !dropdownCtrl ) {
        // No parent dropdown directive; bail.
        return;
      }

      element.addClass(dropdownConfig.dropdownClass);

      dropdownCtrl.initMenu( element );
    }
  };
}])

.directive('dropdownToggle', function() {
  return {
    restrict: 'CA',
    require: '?^dropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if ( !dropdownCtrl ) {
        // No parent dropdown directive; bail.
        return;
      }

      dropdownCtrl.initToggle( element );

      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if ( !element.hasClass('disabled') && !element.prop('disabled') ) {
          scope.$apply(function() {
            dropdownCtrl.toggle();
          });
        }
      });
    }
  };
});
