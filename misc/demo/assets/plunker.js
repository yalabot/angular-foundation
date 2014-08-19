angular.module('plunker', [])

  .factory('plunkGenerator', function ($document) {

    return function (ngVersion, fdVersion, version, module, content) {

      var form = angular.element('<form style="display: none;" method="post" action="http://plnkr.co/edit/?p=preview" target="_blank"></form>');
      var addField = function (name, value) {
        var input = angular.element('<input type="hidden" name="' + name + '">');
        input.attr('value', value);
        form.append(input);
      };

      var indexContent = function (content, version) {
        return '<!doctype html>\n' +
          '<html ng-app="plunker">\n' +
          '  <head>\n' +
          '    <script src="//ajax.googleapis.com/ajax/libs/angularjs/'+ngVersion+'/angular.js"></script>\n' +
          '    <script src="//pineconellc.github.io/angular-foundation/mm-foundation-tpls-'+version+'.js"></script>\n' +
          '    <script src="example.js"></script>\n' +
          '    <link href="//cdnjs.cloudflare.com/ajax/libs/foundation/'+fdVersion+'/css/foundation.css" rel="stylesheet">\n' +
          '  </head>\n' +
          '  <body>\n\n' +
          '    <div class="row">\n' +
          '      <div class="small-12.columns">\n' +
                   content + '\n' +
          '      </div>\n' +
          '    </div>\n'
          '  </body>\n' +
          '</html>\n';
      };

      var scriptContent = function(content) {
        return "angular.module('plunker', ['mm.foundation']);" + "\n" + content;
      };

      addField('description', 'http://pineconellc.github.io/angular-foundation/');
      addField('files[index.html]', indexContent(content.markup, version));
      addField('files[example.js]', scriptContent(content.javascript));

      $document.find('body').append(form);
      form[0].submit();
      form.remove();
    };
  })

  .controller('PlunkerCtrl', function ($scope, plunkGenerator) {

    $scope.content = {};

    $scope.edit = function (ngVersion, fdVersion, version, module) {
      plunkGenerator(ngVersion, fdVersion, version, module, $scope.content);
    };
  })

  .directive('plunkerContent', function () {
    return {
      link:function (scope, element, attrs) {
        scope.content[attrs.plunkerContent] = element.text().trim();
      }
    }
  });
