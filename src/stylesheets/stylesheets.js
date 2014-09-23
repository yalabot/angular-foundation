/*
 * stylesheets - Manipulate sheets in style
 * @example:

    angular.module('mine', ['mm.foundation.stylesheets'])
    .controller(function(stylesheetFactory) {
        var element = angular.element(document.head).find('styles');
        stylesheetFactory(element).css('#myid:before', {
            'background-color': 'red',
            width: '500px'
        });
    });
 */
angular.module('mm.foundation.stylesheets', [])

.factory('stylesheetFactory', ['$document', function ($document) {
    var rulesAsTextContent = function(rules) {
        var textContent = '';
        for (var selector in rules) {
            var props = rules[selector];
            textContent += selector + ' {\n';
            for (var prop in props) {
                textContent += '\t' + prop + ': ' + props[prop] + ';\n';
            }
            textContent += '}\n';
        }
        return textContent;
    };
    return function Stylesheet(element) {
        if (!element) {
            element = $document[0].createElement('style');
            element = angular.element(element);
            angular.element($document[0].querySelector('head')).append(element);
        }
        var write = function(textContent) {
            element.html(textContent);
        };

        var rules = {};
        return {
            element: function() { return element; },
            css: function(selector, content) {
                if (selector in rules) {
                    if (content == rules[selector]) {
                        return;
                    }
                }
                rules[selector] = content;
                write(rulesAsTextContent(rules));
                return this;
            }
        };
    };
}]);
