'use strict';

angular.module('mm.foundation.interchange', [])

	/**
	 * interchageQuery
	 * this service get the different medias
	 * by simulating angular.elements objects
	 * @return {object} Queries list name => mediaQuery
	 */
	.factory('interchangeQueries', [function () {
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
		classPattern = 'meta.foundation-mq-',
		classList = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
		
		for (var i = 0; i < classList.length; i++) {
			element = angular.element(classPattern + classList[i]);
			mediaSize = element.css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '');
			formatList[classList[i]] = mediaSize;
		}
		return formatList;
	}])

	/**
	 * interchangeQueriesManager
	 * interface to add and remove named queries
	 * in the interchangeQueries list
	 */
	.factory('interchangeQueriesManager', ['interchangeQueries', function (interchangeQueries) {
		return {
			add: function (name, media) {
				interchangeQueries[name] = media;
			},
			remove: function (name) {
				if (!!interchangeQueries[name]) {
					delete interchangeQueries[name];
				}
			}
		};
	}])

	/**
	 * interchangeTools
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
					if (breaked.length === 3) {
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
	 * interchange
	 * data-interchange directive
	 * using interchangeTools
	 */
	.directive('interchange', ['$window', 'interchangeTools', function ($window, interchangeTools) {

		return {
			restrict: 'A',
			scope: {},
			link: function postLink(scope, element) {
				
				var replace = function () {
					var currentFile = interchangeTools.findCurrentMediaFile(scope.files);
					if (!!scope.currentFile && scope.currentFile === currentFile) {
						return;
					}
					element.attr(scope.attrName, currentFile);
					scope.currentFile = currentFile;
				};

				// Set up the attribute to update
				scope.attrName = (/IMG/.test(element[0].nodeName)) ? 'src' : 'href';
				scope.attrName = (/DIV/.test(element[0].nodeName)) ? 'ng-include' : scope.attrName;
				scope.files = interchangeTools.parseAttribute(element.attr('data-interchange'));

				// Start
				replace();
				$window.addEventListener('resize', replace);
			}
		};
	}]);