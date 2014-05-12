/**
 * @ngdoc service
 * @name mm.foundation.interchange
 * @description
 *
 * Package containing all services and directives
 * about the `interchange` module
 */
angular.module('mm.foundation.interchange', [])

  /**
   * @ngdoc service
   * @name mm.foundation.interchange.interchageQuery
   * @description
   * this service get the different medias
   * by simulating angular.elements objects
   * @return {object} Queries list name => mediaQuery
   */
  .factory('interchangeQueries', ['$document', function ($document) {
    var element,
      mediaSize,
      formatList = {
      'default': 'only screen',
      landscape : 'only screen and (orientation: landscape)',
      portrait : 'only screen and (orientation: portrait)',
      retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
        'only screen and (min--moz-device-pixel-ratio: 2),' +
        'only screen and (-o-min-device-pixel-ratio: 2/1),' +
        'only screen and (min-device-pixel-ratio: 2),' +
        'only screen and (min-resolution: 192dpi),' +
        'only screen and (min-resolution: 2dppx)'
    },
    classPrefix = 'foundation-mq-',
    classList = ['small', 'medium', 'large', 'xlarge', 'xxlarge'],
    head = angular.element($document[0].querySelector('head'));
    
    for (var i = 0; i < classList.length; i++) {
      head.append('<meta class="' + classPrefix + classList[i] + '" />');
      element = getComputedStyle(head[0].querySelector('meta.' + classPrefix + classList[i]));
      mediaSize = element.fontFamily.replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '');
      formatList[classList[i]] = mediaSize;
    }
    return formatList;
  }])

  /**
   * @ngdoc service
   * @name mm.foundation.interchange.interchangeQueriesManager
   * @description
   * 
   * interface to add and remove named queries
   * in the interchangeQueries list
   */
  .factory('interchangeQueriesManager', ['interchangeQueries', function (interchangeQueries) {
    return {
      add: function (name, media) {
        if (!name || !media ||
          !angular.isString(name) || !angular.isString(media) ||
          !!interchangeQueries[name]) {
          return false;
        }
        interchangeQueries[name] = media;
        return true;
      }
    };
  }])

  /**
   * @ngdoc service
   * @name mm.foundation.interchange.interchangeTools
   * @description
   * 
   * interface to add and remove named queries
   * in the interchangeQueries list
   */
  .factory('interchangeTools', ['$window', 'interchangeQueries', function ($window, namedQueries) {

    // Attribute parser
    var parseAttribute = function (value) {
      var raw = value.split(/\[(.*?)\]/),
        i = raw.length,
        breaker = /^(.+)\,\ \((.+)\)$/,
        breaked,
        output = {};

      while (i--) {
        if (raw[i].replace(/[\W\d]+/, '').length > 4) {
          breaked = breaker.exec(raw[i]);
          if (!!breaked && breaked.length === 3) {
            output[breaked[2]] = breaked[1];
          }
        }
      }
      return output;
    };

    // Find the current item to display form a file list
    var findCurrentMediaFile = function (files) {
      var file, media, match;
      for (file in files) {
        media = namedQueries[file] || file;
        match = $window.matchMedia(media);
        if (match.matches) {
          return files[file];
        }
      }
      return;
    };

    return {
      parseAttribute: parseAttribute,
      findCurrentMediaFile: findCurrentMediaFile
    };
  }])

  /**
   * @ngdoc directive
   * @name mm.foundation.interchange.directive:interchange
   * @restrict A
   * @element DIV|IMG
   * @priority 450
   * @scope
   * @description
   * 
   * interchange directive
   * using interchangeTools
   */
  .directive('interchange', ['$window', '$rootScope', 'interchangeTools', function ($window, $rootScope, interchangeTools) {

    var pictureFilePattern = /[A-Za-z0-9-_]+\.(jpg|jpeg|png|gif|bmp|tiff)\ *,/i;

    return {
      restrict: 'A',
      scope: true,
      priority: 450,
      compile: function compile($element, attrs) {
        // Test if the attribute used is 'data-interchange'
        if (attrs.$attr.interchange !== 'data-interchange') {
          return;
        }

        // Set up the attribute to update
        if ($element[0].nodeName === 'DIV' && !pictureFilePattern.test(attrs.interchange)) {
          $element.html('<ng-include src="currentFile"></ng-include>');
        }

        return {
          pre: function preLink($scope, $element, attrs) {},
          post: function postLink($scope, $element, attrs) {
            var currentFile, nodeName;
            
            // Set up the attribute to update
            nodeName = $element && $element[0] && $element[0].nodeName;
            $scope.fileMap = interchangeTools.parseAttribute(attrs.interchange);

            // Find the type of interchange 
            switch (nodeName) {
            case 'DIV':
              // If the tag is a div, we test the current file to see if it's picture
              currentFile = interchangeTools.findCurrentMediaFile($scope.fileMap);
              if (/[A-Za-z0-9-_]+\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(currentFile)) {
                $scope.type = 'background';
              }
              else {
                $scope.type = 'include';
              }
              break;

            case 'IMG':
              $scope.type = 'image';
              break;

            default:
              return;
            }

            var replace = function (e) {
              // The the new file to display (exit if the same)
              var currentFile = interchangeTools.findCurrentMediaFile($scope.fileMap);
              if (!!$scope.currentFile && $scope.currentFile === currentFile) {
                return;
              }

              // Set up the new file
              $scope.currentFile = currentFile;
              switch ($scope.type) {
              case 'image':
                $element.attr('src', $scope.currentFile);
                break;

              case 'background':
                $element.css('background-image', 'url(' + $scope.currentFile + ')');
                break;
              }

              // Trigger events
              $rootScope.$emit('replace', $element, $scope);
              if (!!e) {
                $scope.$apply();
              }
            };
            
            // Start
            replace();
            $window.addEventListener('resize', replace);
            $scope.$on('$destroy', function () {
              $window.removeEventListener('resize', replace);
            });
          }
        };
      }
    };
  }]);