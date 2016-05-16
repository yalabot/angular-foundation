angular.module( 'mm.foundation.tour', [ 'mm.foundation.position', 'mm.foundation.tooltip' ] )

.service( '$tour', [ '$window', function ( $window ) {
  var currentIndex = getStoredCurrentStep();
  var ended = false;
  var steps = {};

  function getStoredCurrentStep() {
    try {
      return parseInt( $window.localStorage.getItem( 'mm.tour.step' ), 10 );
    } catch(e) {
      if (e.name !== "SecurityError") {
        throw e;
      }
    }
  }

  function storeCurrentStep() {
    try {
      $window.localStorage.setItem( 'mm.tour.step', currentIndex );
    } catch(e) {
      if (e.name !== "SecurityError") {
        throw e;
      }
    }
  }

  function setCurrentStep(step) {
    currentIndex = step;
    storeCurrentStep();
  }

  this.add = function ( index, attrs ) {
    steps[ index ] = attrs;
  };

  this.has = function ( index ) {
    return !!steps[ index ];
  };

  this.isActive = function () {
    return currentIndex > 0;
  };

  this.current = function ( index ) {
    if ( index ) {
      setCurrentStep( currentIndex );
    } else {
      return currentIndex;
    }
  };

  this.start = function () {
    setCurrentStep( 1 );
  };

  this.next = function () {
    setCurrentStep( currentIndex + 1 );
  };

  this.end = function () {
    setCurrentStep( 0 );
  };
}])

.directive( 'stepTextPopup', ['$tour', function ( $tour ) {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tour/tour.html',
    link: function (scope, element) {
      scope.isLastStep = function () {
        return !$tour.has( $tour.current() + 1 );
      };

      scope.endTour = function () {
        element.remove();
        $tour.end();
      };

      scope.nextStep = function () {
        element.remove();
        $tour.next();
      };

      scope.$on('$locationChangeSuccess', scope.endTour);
    }
  };
}])

.directive( 'stepText', [ '$position', '$tooltip', '$tour', '$window', function ( $position, $tooltip, $tour, $window ) {
  function isElementInViewport( element ) {
    var rect = element[0].getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= ($window.innerHeight - 80) &&
      rect.right <= $window.innerWidth
    );
  }

  function show( scope, element, attrs ) {
    var index = parseInt( attrs.stepIndex, 10);

    if ( $tour.isActive() && index ) {
      $tour.add( index, attrs );

      if ( index === $tour.current() ) {
        if ( !isElementInViewport( element ) ) {
          var offset = $position.offset( element );
          $window.scrollTo( 0, offset.top - $window.innerHeight / 2 );
        }

        return true;
      }
    }

    return false;
  }

  return $tooltip( 'stepText', 'step', show );
}]);
