/**
 * @ngdoc service
 * @name mm.foundation.interchange
 * @description
 *
 * Package containing all services and directives
 * about the `interchange` module
 */
angular.module('mm.foundation.interchange', ['mm.foundation.mediaQueries'])

  /**
   * @ngdoc function
   * @name mm.foundation.interchange.interchageQuery
   * @function interchageQuery
   * @description
   *
   * this service inject meta tags objects in the head
   * to get the list of media queries from Foundation
   * stylesheets.
   *
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
   * @ngdoc function
   * @name mm.foundation.interchange.interchangeQueriesManager
   * @function interchangeQueriesManager
   * @description
   *
   * interface to add and remove named queries
   * in the interchangeQueries list
   */
  .factory('interchangeQueriesManager', ['interchangeQueries', function (interchangeQueries) {
    return {
      /**
       * @ngdoc method
       * @name interchangeQueriesManager#add
       * @methodOf mm.foundation.interchange.interchangeQueriesManager
       * @description
       *
       * Add a custom media query in the `interchangeQueries`
       * factory. This method does not allow to update an existing
       * media query.
       *
       * @param {string} name MediaQuery name
       * @param {string} media MediaQuery
       * @returns {boolean} True if the insert is a success
       */
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
   * @ngdoc function
   * @name mm.foundation.interchange.interchangeTools
   * @function interchangeTools
   * @description
   *
   * Tools to help with the `interchange` module.
   */
  .factory('interchangeTools', ['$window', 'matchMedia', 'interchangeQueries', function ($window, matchMedia, namedQueries) {

    /**
     * @ngdoc method
     * @name interchangeTools#parseAttribute
     * @methodOf mm.foundation.interchange.interchangeTools
     * @description
     *
     * Attribute parser to transform an `interchange` attribute
     * value to an object with media query (name or query) as key,
     * and file to use as value.
     *
     * ```
     * {
     *   small: 'bridge-500.jpg',
     *   large: 'bridge-1200.jpg'
     * }
     * ```
     *
     * @param {string} value Interchange query string
     * @returns {object} Attribute parsed
     */
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

    /**
     * @ngdoc method
     * @name interchangeTools#findCurrentMediaFile
     * @methodOf mm.foundation.interchange.interchangeTools
     * @description
     *
     * Find the current item to display from a file list
     * (object returned by `parseAttribute`) and the
     * current page dimensions.
     *
     * ```
     * {
     *   small: 'bridge-500.jpg',
     *   large: 'bridge-1200.jpg'
     * }
     * ```
     *
     * @param {object} files Parsed version of `interchange` attribute
     * @returns {string} File to display (or `undefined`)
     */
    var findCurrentMediaFile = function (files) {
      var file, media, match;
      for (file in files) {
        media = namedQueries[file] || file;
        match = matchMedia(media);
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
   * @scope true
   * @description
   *
   * Interchange directive, following the same features as
   * ZURB documentation. The directive is splitted in 3 parts.
   *
   * 1. This directive use `compile` and not `link` for a simple
   * reason: if the method is applied on a DIV element to
   * display a template, the compile method will inject an ng-include.
   * Because using a `templateUrl` or `template` to do it wouldn't
   * be appropriate for all cases (`IMG` or dynamic backgrounds).
   * And doing it in `link` is too late to be applied.
   *
   * 2. In the `compile:post`, the attribute is parsed to find
   * out the type of content to display.
   *
   * 3. At the start and on event `resize`, the method `replace`
   * is called to reevaluate which file is supposed to be displayed
   * and update the value if necessary. The methd will also
   * trigger a `replace` event.
   */
  .directive('interchange', ['$window', '$rootScope', 'interchangeTools', function ($window, $rootScope, interchangeTools) {

    var pictureFilePattern = /[A-Za-z0-9-_]+\.(jpg|jpeg|png|gif|bmp|tiff)\ *,/i;

    return {
      restrict: 'A',
      scope: true,
      priority: 450,
      compile: function compile($element, attrs) {
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
