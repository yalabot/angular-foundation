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
        return textContent.slice(0, -1);
    };
    return function Stylesheet(element) {
      var $head = angular.element($document[0].querySelector('head'));
      if (!element) {
        element = $document[0].createElement('style');
        element = angular.element(element);
      }
      var currentContent = element.text();
      var write = function(textContent) {
        if (textContent !== currentContent) {
          currentContent = textContent;
          element.text(textContent);
          if (currentContent === '') {
            element.remove();
          }
          else if (!$head[0].contains(element[0])) {
            $head.append(element);
          }
        }
      };

      var rules = {};
      return {
        element: function() { return element; },
        css: function(selector, content) {
          var exists = selector in rules;
          if (typeof content === 'undefined') {
            return exists ? rules[selector] : null;
          }
          if (!exists || content != rules[selector]) {
            if (content === null)
              delete rules[selector];
            else
              rules[selector] = content;
          }
          return this;
        },
        sync: function() {
          write(rulesAsTextContent(rules));
        }
      };
    };
  }]);
