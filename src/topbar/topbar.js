angular.module("mm.foundation.topbar", ['mm.foundation.mediaQueries'])
.factory('closest', [function() {
  return function(el, selector) {
    var matchesSelector = function (node, selector) {
      var nodes = (node.parentNode || node.document).querySelectorAll(selector);
      var i = -1;
      while (nodes[++i] && nodes[i] != node){}
      return !!nodes[i];
    };

    var element = el[0];
    while (element) {
      if (matchesSelector(element, selector)) {
        return angular.element(element);
      } else {
        element = element.parentElement;
      }
    }
    return false;
  };
}])
.directive('topBar', ['$timeout','$compile', '$window', '$document', 'mediaQueries',
  function($timeout, $compile, $window, $document, mediaQueries) {
    return {
      scope: {
        stickyClass : '@',
        backText: '@',
        stickyOn : '=',
        customBackText: '=',
        isHover: '=',
        mobileShowParentLink: '=',
        scrolltop : '=',
      },
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/topbar/top-bar.html',
      transclude: true,
      controller: ['$window', '$scope', 'closest', function($window, $scope, closest) {
        $scope.settings = {};
        $scope.settings.stickyClass = $scope.stickyClass || 'sticky';
        $scope.settings.backText = $scope.backText || 'Back';
        $scope.settings.stickyOn = $scope.stickyOn || 'all';

        $scope.settings.customBackText = $scope.customBackText === undefined ? true : $scope.customBackText;
        $scope.settings.isHover = $scope.isHover === undefined ? true : $scope.isHover;
        $scope.settings.mobileShowParentLink = $scope.mobileShowParentLink === undefined ? true : $scope.mobileShowParentLink;
        $scope.settings.scrolltop = $scope.scrolltop === undefined ? true : $scope.scrolltop; // jump to top when sticky nav menu toggle is clicked

        this.settings = $scope.settings;

        $scope.index = 0;

        var outerHeight = function(el) {
          var height = el.offsetHeight;
          var style = el.currentStyle || getComputedStyle(el);

          height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
          return height;
        };


        var sections = [];

        this.addSection = function(section) {
          sections.push(section);
        };

        this.removeSection = function(section) {
          var index = sections.indexOf(section);
          if (index > -1) {
            sections.splice(index, 1);
          }
        };

        var dir = /rtl/i.test($document.find('html').attr('dir')) ? 'right' : 'left';

        $scope.$watch('index', function(index) {
          for(var i = 0; i < sections.length; i++){
            sections[i].move(dir, index);
          }
        });

        this.toggle = function(on) {
          $scope.toggle(on);
          for(var i = 0; i < sections.length; i++){
            sections[i].reset();
          }
          $scope.index = 0;
          $scope.height = '';
          $scope.$apply();
        };

        this.back = function(event) {
          if($scope.index < 1 || !mediaQueries.topbarBreakpoint()){
            return;
          }

          var $link = angular.element(event.currentTarget);
          var $movedLi = closest($link, 'li.moved');
          var $previousLevelUl = $movedLi.parent();
          $scope.index = $scope.index -1;

          if($scope.index === 0){
            $scope.height = '';
          } else {
            $scope.height = $scope.originalHeight + outerHeight($previousLevelUl[0]);
          }

          $timeout(function() {
            $movedLi.removeClass('moved');
          }, 300);
        };

        this.forward = function(event) {
          if(!mediaQueries.topbarBreakpoint()){
            return false;
          }

          var $link = angular.element(event.currentTarget);
          var $selectedLi = closest($link, 'li');
          $selectedLi.addClass('moved');
          $scope.height = $scope.originalHeight + outerHeight($link.parent()[0].querySelector('ul'));
          $scope.index = $scope.index + 1;
          $scope.$apply();
        };

      }],
      link: function(scope, element, attrs) {
        var topbar = scope.topbar = element;
        var topbarContainer = topbar.parent();
        var body = angular.element($document[0].querySelector('body'));
        var lastBreakpoint = mediaQueries.topbarBreakpoint();

        var isSticky = scope.isSticky = function() {
          var sticky = topbarContainer.hasClass(scope.settings.stickyClass);
          if (sticky && scope.settings.stickyOn === 'all') {
            return true;
          } else if (sticky && mediaQueries.small() && scope.settings.stickyOn === 'small') {
            return true;
          } else if (sticky && mediaQueries.medium() && scope.settings.stickyOn === 'medium') {
            return true;
          } else if (sticky && mediaQueries.large() && scope.settings.stickyOn === 'large') {
            return true;
          }
          return false;
        };

        var updateStickyPositioning = function() {
          if (!scope.stickyTopbar || !scope.isSticky()) {
            return;
          }

          var distance = stickyoffset;

          if ($window.pageYOffset > distance && !topbarContainer.hasClass('fixed')) {
            topbarContainer.addClass('fixed');
            body.css('padding-top', scope.originalHeight + 'px');
          } else if ($window.pageYOffset <= distance && topbarContainer.hasClass('fixed')) {
            topbarContainer.removeClass('fixed');
            body.css('padding-top', '');
          }
        };

        var onResize = function() {
          var currentBreakpoint = mediaQueries.topbarBreakpoint();
          if(lastBreakpoint === currentBreakpoint){
            return;
          }
          lastBreakpoint = mediaQueries.topbarBreakpoint();

          topbar.removeClass('expanded');
          topbar.parent().removeClass('expanded');
          scope.height = '';

          var sections = angular.element(topbar[0].querySelectorAll('section'));
          angular.forEach(sections, function(section) {
            angular.element(section.querySelectorAll('li.moved')).removeClass('moved');
          });

          scope.$apply();
        };

        var onScroll = function() {
          updateStickyPositioning();
          scope.$apply();
        };

        scope.toggle = function(on) {
          if(!mediaQueries.topbarBreakpoint()){
            return false;
          }

          var expand = (on === undefined) ? !topbar.hasClass('expanded') : on;

          if (expand) {
            topbar.addClass('expanded');
          }
          else {
            topbar.removeClass('expanded');
          }

          if (scope.settings.scrolltop) {
            if (!expand && topbar.hasClass('fixed')) {
              topbar.parent().addClass('fixed');
              topbar.removeClass('fixed');
              body.css('padding-top', scope.originalHeight + 'px');
            } else if (expand && topbar.parent().hasClass('fixed')) {
              topbar.parent().removeClass('fixed');
              topbar.addClass('fixed');
              body.css('padding-top', '');
              $window.scrollTo(0,0);
            }
          } else {
            if(isSticky()) {
              topbar.parent().addClass('fixed');
            }

            if(topbar.parent().hasClass('fixed')) {
              if (!expand) {
                topbar.removeClass('fixed');
                topbar.parent().removeClass('expanded');
                updateStickyPositioning();
              } else {
                topbar.addClass('fixed');
                topbar.parent().addClass('expanded');
                body.css('padding-top', scope.originalHeight + 'px');
              }
            }
          }
        };

        if(topbarContainer.hasClass('fixed') || isSticky() ) {
          scope.stickyTopbar = true;
          scope.height = topbarContainer[0].offsetHeight;
          var stickyoffset = topbarContainer[0].getBoundingClientRect().top + $window.pageYOffset;
        } else {
          scope.height = topbar[0].offsetHeight;
        }

        scope.originalHeight = scope.height;

        scope.$watch('height', function(h) {
          if(h){
            topbar.css('height', h + 'px');
          } else {
            topbar.css('height', '');
          }
        });

        angular.element($window).bind('resize', onResize);
        angular.element($window).bind('scroll', onScroll);

        scope.$on('$destroy', function() {
          angular.element($window).unbind('scroll', onResize);
          angular.element($window).unbind('resize', onScroll);
        });

        if (topbarContainer.hasClass('fixed')) {
          body.css('padding-top', scope.originalHeight + 'px');
        }
      }
    };
  }]
)
.directive('toggleTopBar', ['closest', function (closest) {
  return {
    scope: {},
    require: '^topBar',
    restrict: 'A',
    replace: true,
    templateUrl: 'template/topbar/toggle-top-bar.html',
    transclude: true,
    link: function(scope, element, attrs, topBar) {
      element.bind('click', function(event) {
        var li = closest(angular.element(event.currentTarget), 'li');
        if(!li.hasClass('back') && !li.hasClass('has-dropdown')) {
          topBar.toggle();
        }
      });

      scope.$on('$destroy', function() {
        element.unbind('click');
      });
    }
  };
}])
.directive('topBarSection', ['$compile', 'closest', function($compile, closest) {
  return {
    scope: {},
    require: '^topBar',
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/topbar/top-bar-section.html',
    transclude: true,
    link: function(scope, element, attrs, topBar) {
      var section = element;

      scope.reset = function() {
        angular.element(section[0].querySelectorAll('li.moved')).removeClass('moved');
      };

      scope.move = function(dir, index) {
        if(dir === 'left'){
          section.css({"left": index * -100 + '%'});
        }
        else {
          section.css({"right": index * -100 + '%'});
        }
      };

      topBar.addSection(scope);

      scope.$on("$destroy", function() {
        topBar.removeSection(scope);
      });

      // Top level links close menu on click
      var links = section[0].querySelectorAll('li>a');
      angular.forEach(links, function(link) {
        var $link = angular.element(link);
        var li = closest($link, 'li');
        if (li.hasClass('has-dropdown') || li.hasClass('back') || li.hasClass('title')) {
          return;
        }

        $link.bind('click', function() {
          topBar.toggle(false);
        });

        scope.$on('$destroy', function() {
          $link.bind('click');
        });
      });
    }
  };
}])
.directive('hasDropdown', ['mediaQueries', function (mediaQueries) {
  return {
    scope: {},
    require: '^topBar',
    restrict: 'A',
    templateUrl: 'template/topbar/has-dropdown.html',
    replace: true,
    transclude: true,
    link: function(scope, element, attrs, topBar) {
      scope.triggerLink = element.children('a')[0];

      var $link = angular.element(scope.triggerLink);

      $link.bind('click', function(event) {
        topBar.forward(event);
      });
      scope.$on('$destroy', function() {
        $link.unbind('click');
      });

      element.bind('mouseenter', function() {
        if(topBar.settings.isHover && !mediaQueries.topbarBreakpoint()){
          element.addClass('not-click');
        }
      });
      element.bind('click', function(event) {
        if(!topBar.settings.isHover && !mediaQueries.topbarBreakpoint()){
          element.toggleClass('not-click');
        }
      });

      element.bind('mouseleave', function() {
        element.removeClass('not-click');
      });

      scope.$on('$destroy', function() {
        element.unbind('click');
        element.unbind('mouseenter');
        element.unbind('mouseleave');
      });
    },
    controller: ['$window', '$scope', function($window, $scope) {
      this.triggerLink = $scope.triggerLink;
    }]
  };
}])
.directive('topBarDropdown', ['$compile', function($compile) {
  return {
    scope: {},
    require: ['^topBar', '^hasDropdown'],
    restrict: 'A',
    replace: true,
    templateUrl: 'template/topbar/top-bar-dropdown.html',
    transclude: true,
    link: function(scope, element, attrs, ctrls) {
      var topBar = ctrls[0];
      var hasDropdown = ctrls[1];
      var $link = angular.element(hasDropdown.triggerLink);
      var url = $link.attr('href');
      var $titleLi;

      scope.linkText = $link.text();

      scope.back = function(event) {
        topBar.back(event);
      };

      // Add back link
      if (topBar.settings.customBackText) {
        scope.backText = topBar.settings.backText;
      } else {
        scope.backText = '&laquo; ' + $link.html();
      }

      if (topBar.settings.mobileShowParentLink && url && url.length > 1) {
        $titleLi = angular.element('<li class="title back js-generated">' +
            '<h5><a href="#" ng-click="back($event);">{{backText}}</a></h5></li>' +
            '<li><a class="parent-link js-generated" href="' +
            url + '">{{linkText}}</a></li>');
      } else {
        $titleLi = angular.element('<li class="title back js-generated">' +
            '<h5><a href="" ng-click="back($event);">{{backText}}</a></h5></li>');
      }

      $compile($titleLi)(scope);
      element.prepend($titleLi);
    }
  };
}]);
