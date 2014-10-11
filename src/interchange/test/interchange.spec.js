describe("interchange", function () {

  var scope, $compile, domObj;
  var element;

  beforeEach(function () {
    domObj = domObj || document.createElement('style');
    domObj.innerHTML = 'meta.foundation-mq-small {font-family: "/only screen and (max-width:40em)/";}' +
      'meta.foundation-mq-medium {font-family: "/only screen and (min-width:40.063em)/";}' +
      'meta.foundation-mq-large {font-family: "/only screen and (min-width:64.063em)/";}' +
      'meta.foundation-mq-xlarge {font-family: "/only screen and (min-width:90.063em)/";}' +
      'meta.foundation-mq-xxlarge {font-family: "/only screen and (min-width:120.063em)/";}';
    document.head.appendChild(domObj);
  });

  beforeEach(module('mm.foundation.interchange'));

  describe("interchangeQueries", function () {

    var interchangeQueries;

    beforeEach(inject(function ($rootScope, _$compile_, _interchangeQueries_) {
      scope = $rootScope;
      $compile = _$compile_;
      interchangeQueries = _interchangeQueries_;
    }));

    it('should define the different media sizes with the correct data', function () {
      $compile(element)(scope);
      scope.$digest();
      expect(interchangeQueries.small).toEqual('only screen and (max-width:40em)');
      expect(interchangeQueries.medium).toEqual('only screen and (min-width:40.063em)');
      expect(interchangeQueries.large).toEqual('only screen and (min-width:64.063em)');
      expect(interchangeQueries.xlarge).toEqual('only screen and (min-width:90.063em)');
      expect(interchangeQueries.xxlarge).toEqual('only screen and (min-width:120.063em)');
    });
  });

  describe("interchangeQueriesManager", function () {

    var interchangeQueries, interchangeQueriesManager;

    beforeEach(inject(function ($rootScope, _$compile_, _interchangeQueries_, _interchangeQueriesManager_) {
      scope = $rootScope;
      $compile = _$compile_;
      interchangeQueries = _interchangeQueries_;
      interchangeQueriesManager = _interchangeQueriesManager_;
    }));

    it("should check parameters", function () {
      expect(interchangeQueriesManager.add(1, 'screen')).toEqual(false);
      expect(interchangeQueriesManager.add([], 'screen')).toEqual(false);
      expect(interchangeQueriesManager.add({}, 'screen')).toEqual(false);
      expect(interchangeQueriesManager.add(function(){}, 'screen')).toEqual(false);
      expect(interchangeQueriesManager.add('custom', 1)).toEqual(false);
      expect(interchangeQueriesManager.add('custom', [])).toEqual(false);
      expect(interchangeQueriesManager.add('custom', {})).toEqual(false);
      expect(interchangeQueriesManager.add('custom', function(){})).toEqual(false);
    });

    it("should add a new media type", function () {
      var mediaName = 'sixhundred';
      var mediaValue = 'only screen and (max-width:600px)';
      expect(interchangeQueriesManager.add(mediaName, mediaValue)).toEqual(true);
      expect(interchangeQueries[mediaName]).toEqual(mediaValue);
    });

    it("should add a new media type", function () {
      var mediaName = 'sevenhundred';
      var mediaValue = 'only screen and (max-width:600px)';
      expect(interchangeQueriesManager.add(mediaName, mediaValue)).toEqual(true);
      expect(interchangeQueries[mediaName]).toEqual(mediaValue);
    });

    it("should block any update of a media type", function () {
      var mediaName = 'medium';
      var mediaValue = 'only screen and (max-width:600px)';
      var mediaValuePre = interchangeQueries[mediaName];
      expect(interchangeQueriesManager.add(mediaName, mediaValue)).toEqual(false);
      expect(interchangeQueries[mediaName]).toEqual(mediaValuePre);
      expect(interchangeQueries[mediaName]).toNotEqual(mediaValue);
    });
  });

  describe("interchangeTools", function () {

    var interchangeTools, matchMediaMock;

    beforeEach(inject(function (_interchangeTools_) {
      interchangeTools = _interchangeTools_;
    }));

    beforeEach(function () {
      angular.module('mm.foundation.interchange')
        .factory('matchMedia', function() {
          return function(media) {
            return {
              matches: (matchMediaMock === media),
              media: media
            };
          };
      });
    });

    it('should parse data-interchange attribute', function () {
      var parsed = interchangeTools.parseAttribute('[default.html, (small)], [(medium)], [large.html, (only screen and (min-width:90.063em))], troll');
      expect(parsed.small).toEqual('default.html');
      expect(parsed.medium).toBeUndefined();
      expect(parsed['only screen and (min-width:90.063em)']).toEqual('large.html');
      expect(parsed.troll).toBeUndefined();
    });

    it('should find the correct files', function () {
      var files = {
        small: 'default.html',
        large: 'large.html',
        'only print': 'print.html'
      };
      matchMediaMock = 'only screen and (max-width:40em)';
      expect(interchangeTools.findCurrentMediaFile(files)).toEqual('default.html');
      matchMediaMock = 'only screen and (min-width:64.063em)';
      expect(interchangeTools.findCurrentMediaFile(files)).toEqual('large.html');
      matchMediaMock = 'only print';
      expect(interchangeTools.findCurrentMediaFile(files)).toEqual('print.html');
    });

    it('should return undefined if no media fits', function () {
      var files = {
        small: 'default.html',
      };
      matchMediaMock = 'only print';
      expect(interchangeTools.findCurrentMediaFile(files)).toBeUndefined();
    });

    describe("interchange directive", function () {

      var element, $httpBackend, $window;

      beforeEach(inject(function ($rootScope, _$window_, _$httpBackend_, _$compile_, $controller) {
        if (element) {
          element.remove();
        }
        scope = $rootScope;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $window = _$window_;
      }));

      it('should insert the correct template for the good window size', function () {
        element = angular.element('<div data-interchange="[default.html, (small)], [large.html, (large)]"></div>');

        $httpBackend.expectGET('default.html').respond('default template');
        matchMediaMock = 'only screen and (max-width:40em)';
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBeUndefined();
        expect(element.text()).toEqual('default template');

        $httpBackend.expectGET('large.html').respond('large template');
        matchMediaMock = 'only screen and (min-width:64.063em)';
        window.dispatchEvent(new Event('resize'));
        $httpBackend.flush();
        expect(element.text()).toEqual('large template');
      });

      it('should insert the correct background picture for the good window size', function () {
        element = angular.element('<div data-interchange="[default.jpg, (small)], [large.TIFF, (large)]">hi</div>');

        matchMediaMock = 'only screen and (max-width:40em)';
        $compile(element)(scope);
        scope.$digest();
        expect(element.attr('src')).toBeUndefined();
        expect(element.attr('style')).toMatch(/background-image:\ ?url\([a-zA-Z0-9\.\\\/\@\:]*default\.jpg\)/);

        matchMediaMock = 'only screen and (min-width:64.063em)';
        window.dispatchEvent(new Event('resize'));
        expect(element.attr('style')).toMatch(/background-image:\ ?url\([a-zA-Z0-9\.\\\/\@\:]*large\.TIFF\)/);
      });

      it('should not change the content when the interchange is for dynamic background', function () {
        element = angular.element('<div data-interchange="[default.jpg, (small)], [large.TIFF, (large)]">hi</div>');

        matchMediaMock = 'only screen and (max-width:40em)';
        $compile(element)(scope);
        scope.$digest();
        expect(element.text()).toEqual('hi');
      });

      it('should insert the correct picture for the good window size', function () {
        element = angular.element('<img data-interchange="[default.jpg, (small)], [large.jpg, (large)]">');

        matchMediaMock = 'only screen and (max-width:40em)';
        $compile(element)(scope);
        scope.$digest();
        expect(element.attr('src')).toEqual('default.jpg');
        expect(element.children().length).toEqual(0);

        matchMediaMock = 'only screen and (min-width:64.063em)';
        window.dispatchEvent(new Event('resize'));
        expect(element.attr('src')).toEqual('large.jpg');
      });

      it('should insert the correct picture for the custom media size', function () {
        element = angular.element('<img data-interchange="[default.jpg, (small)], [large.jpg, (only print)]">');

        matchMediaMock = 'only print';
        $compile(element)(scope);
        scope.$digest();
        expect(element.attr('src')).toEqual('large.jpg');
        expect(element.children().length).toEqual(0);
      });

      it('should set up noting', function () {
        element = angular.element('<img data-interchange="">');

        $compile(element)(scope);
        scope.$digest();
        expect(element.attr('src')).toBeUndefined();
        expect(element.children().length).toEqual(0);
      });

      it('should clear listeners when the scope is destroyed', function () {
        spyOn($window, 'removeEventListener');
        element = angular.element('<img data-interchange="[default.jpg, (small)], [large.jpg, (large)]">');

        matchMediaMock = 'only screen and (max-width:40em)';
        $compile(element)(scope);
        scope.$digest();

        element.scope().$destroy();
        scope.$digest();
        expect($window.removeEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
      });
    });
  });

});
