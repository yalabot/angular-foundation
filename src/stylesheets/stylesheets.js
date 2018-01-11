/*
 * stylesheets - Manipulate sheets in style
 * @example:

    function(stylesheetFactory) {
        stylesheetFactory().css('#myid:before', {
            'background-color': 'red',
            width: '500px'
        }).sync();
    }
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
    var head = $document[0].querySelector('head');
    return function Stylesheet(element) {
      if (!element) {
        element = $document[0].createElement('style');
      }
      var write = function(textContent) {
        if (textContent === '') {
          head.removeChild(element);
          return true;
        }
        else if (textContent !== element.textContent) {
          element.textContent = textContent;
          if (!head.contains(element)) {
            head.appendChild(element);
            return true;
          }
        }
        return false;
      };

      var rules = {};
      var setRules = function(selector, content) {
        if (content === null) {
          delete rules[selector];
        }
        else {
          if (!(selector in rules)) {
            rules[selector] = {};
          }
          for (var _rule in content) {
            if (content[_rule] === null) {
              delete rules[selector][_rule];
            }
            else {
              rules[selector][_rule] = content[_rule];
            }
          }
        }
      };
      return {
        element: function() { return element; },
        css: function(selector, content) {
          var exists = selector in rules;
          if (typeof content === 'undefined') {
            return exists ? rules[selector] : null;
          }
          if (!exists || content != rules[selector]) {
            setRules(selector, content);
          }
          return this;
        },
        sync: function() {
          return write(rulesAsTextContent(rules));
        }
      };
    };
  }]);
