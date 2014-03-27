angular.module("mm.foundation.topbar", [])
    .run(['$window', '$document', function($window, $document) { // provider-injector
        // polyfils
        $window.matchMedia = $window.matchMedia || (function( doc, undefined ) {

            "use strict";

            var bool,
                docElem = doc.documentElement,
                refNode = docElem.firstElementChild || docElem.firstChild,
                // fakeBody required for <FF4 when executed in <head>
                fakeBody = doc.createElement( "body" ),
                div = doc.createElement( "div" );

            div.id = "mq-test-1";
            div.style.cssText = "position:absolute;top:-100em";
            fakeBody.style.background = "none";
            fakeBody.appendChild(div);

            return function (q) {
                div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

                docElem.insertBefore( fakeBody, refNode );
                bool = div.offsetWidth === 42;
                docElem.removeChild( fakeBody );

                return {
                    matches: bool,
                    media: q
                };

            };

        }( $document[0] ));

        // https://github.com/jonathantneal/Polyfills-for-IE8/blob/master/getComputedStyle.js
        // getComputedStyle
        this.getComputedStyle = this.getComputedStyle || (function () {
            function getPixelSize(element, style, property, fontSize) {
                var
                sizeWithSuffix = style[property],
                size = parseFloat(sizeWithSuffix),
                suffix = sizeWithSuffix.split(/\d/)[0],
                rootSize;

                fontSize = fontSize != null ? fontSize : /%|em/.test(suffix) && element.parentElement ? getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) : 16;
                rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

                return (suffix == 'em') ? size * fontSize : (suffix == 'in') ? size * 96 : (suffix == 'pt') ? size * 96 / 72 : (suffix == '%') ? size / 100 * rootSize : size;
            }

            function setShortStyleProperty(style, property) {
                var
                borderSuffix = property == 'border' ? 'Width' : '',
                t = property + 'Top' + borderSuffix,
                r = property + 'Right' + borderSuffix,
                b = property + 'Bottom' + borderSuffix,
                l = property + 'Left' + borderSuffix;

                style[property] = (style[t] == style[r] == style[b] == style[l] ? [style[t]]
                : style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]]
                : style[l] == style[r] ? [style[t], style[r], style[b]]
                : [style[t], style[r], style[b], style[l]]).join(' ');
            }

            function CSSStyleDeclaration(element) {
                var
                currentStyle = element.currentStyle,
                style = this,
                fontSize = getPixelSize(element, currentStyle, 'fontSize', null);

                for (var property in currentStyle) {
                    if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
                        style[property] = getPixelSize(element, currentStyle, property, fontSize) + 'px';
                    } else if (property === 'styleFloat') {
                        style['float'] = currentStyle[property];
                    } else {
                        style[property] = currentStyle[property];
                    }
                }

                setShortStyleProperty(style, 'margin');
                setShortStyleProperty(style, 'padding');
                setShortStyleProperty(style, 'border');

                style.fontSize = fontSize + 'px';

                return style;
            }

            CSSStyleDeclaration.prototype = {
                constructor: CSSStyleDeclaration,
                getPropertyPriority: function () {},
                getPropertyValue: function ( prop ) {
                    return this[prop] || '';
                },
                item: function () {},
                removeProperty: function () {},
                setProperty: function () {},
                getPropertyCSSValue: function () {}
            };

            function getComputedStyle(element) {
                return new CSSStyleDeclaration(element);
            }

            return getComputedStyle;
        })(this);

        // https://gist.github.com/jonathantneal/3062955
        (this.Element && function(ElementPrototype) {
            ElementPrototype.matchesSelector = ElementPrototype.matchesSelector || 
            ElementPrototype.mozMatchesSelector ||
            ElementPrototype.msMatchesSelector ||
            ElementPrototype.oMatchesSelector ||
            ElementPrototype.webkitMatchesSelector ||
            function (selector) {
                var node = this;
                var nodes = (node.parentNode || node.document).querySelectorAll(selector);
                var i = -1;
         
                while (nodes[++i] && nodes[i] != node){}
         
                return !!nodes[i];
            };
        })(Element.prototype);

        angular.element.prototype.closest = angular.element.prototype.closest || function(selector) {
            element = this[0];
            while (element) {
                if (element.matchesSelector(selector)) {
                    return angular.element(element);
                } else {
                    element = element.parentElement;
                }
            }
            return false;
        };
    }])
    .directive('topBar', ['$timeout','$compile', '$window', '$document',
        function ($timeout, $compile, $window, $document) {
        
        var win = angular.element($window);
        var head = angular.element($document[0].querySelector('head'));
        var body = angular.element($document[0].querySelector('body'));
        var html = $document.find('html');
        var rtl = /rtl/i.test(html.attr('dir'));

        head.append('<meta class="foundation-mq-topbar" />');
        head.append('<meta class="foundation-mq-small" />');
        head.append('<meta class="foundation-mq-medium" />');
        head.append('<meta class="foundation-mq-large" />');

        var media_queries = {
            topbar: getComputedStyle(head[0].querySelector('meta.foundation-mq-topbar')).fontFamily.replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            small : getComputedStyle(head[0].querySelector('meta.foundation-mq-small')).fontFamily.replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            medium : getComputedStyle(head[0].querySelector('meta.foundation-mq-medium')).fontFamily.replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            large : getComputedStyle(head[0].querySelector('meta.foundation-mq-large')).fontFamily.replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
        };

        var breakpoint = function () {
            return !$window.matchMedia(media_queries['topbar']).matches;
        };

        var small = function () {
            return $window.matchMedia(media_queries['small']).matches;
        };

        var medium = function () {
            return $window.matchMedia(media_queries['medium']).matches;
        };

        var large = function () {
            return $window.matchMedia(media_queries['large']).matches;
        };

        var is_sticky = function (topbar, topbarContainer, settings) {
            var sticky = topbarContainer.hasClass(settings.sticky_class);

            if (sticky && settings.sticky_on === 'all') {
                return true;
            } else if (sticky && small() && settings.sticky_on === 'small') {
                return true;
            } else if (sticky && medium() && settings.sticky_on === 'medium') {
                return true;
            } else if (sticky && large() && settings.sticky_on === 'large') {
                return true;
            }

            return false;
        };

        var outerHeight = function(el){
          var height = el.offsetHeight;
          var style = el.currentStyle || getComputedStyle(el);

          height += parseInt(style.marginTop) + parseInt(style.marginBottom);
          return height;
        };

        return {
            scope: {
                "options": "=",
            },
            restrict: 'C',
            compile: function compile(element, attrs) {

                return function ($scope, element, attrs) {
                    var settings = {
                        sticky_class : 'sticky',
                        custom_back_text: true,
                        back_text: 'Back',
                        is_hover: true,
                        mobile_show_parent_link: true,
                        scrolltop : true, // jump to top when sticky nav menu toggle is clicked
                        sticky_on : 'all'
                    };

                    angular.extend(settings, $scope.options);
                    $scope.settings = settings;

                    var topbar = $scope.topbar = element;
                    var topbarContainer = topbar.parent();
                    //var titlebar = topbar.children().filter('ul').first();

                    // menu index
                    $scope.index = 0;

                    $scope.back = function(event) {
                        if($scope.index < 1 || !breakpoint()){
                            return;
                        }
                        
                        $link = angular.element(event.currentTarget);
                        $movedLi = $link.closest('li.moved');
                        $previousLevelUl = $movedLi.parent();
                        $scope.index = $scope.index -1;

                        if($scope.index === 0){
                            $scope.height = '';
                        } else {
                            $scope.height = topbar_height + outerHeight($previousLevelUl[0]);
                        }

                        $timeout(function () {
                            $movedLi.removeClass('moved');
                        }, 300);
                    };

                    $scope.forward = function(event) {
                        if(!breakpoint()){
                            return false;
                        }

                        $link = angular.element(event.currentTarget);
                        $selectedLi = $link.closest('li');
                        $selectedLi.addClass('moved');
                        $scope.height = topbar_height + outerHeight($link.parent()[0].querySelector('ul'));
                        $scope.index = $scope.index + 1;
                    };

                    $scope.toggle = function(on) {
                        if(!breakpoint()){
                            return false;
                        }
                        
                        var sections = angular.element(topbar[0].querySelectorAll('section'));
                        angular.forEach(sections, function(section){
                            angular.element(section.querySelectorAll('li.moved')).removeClass('moved');
                        });
                        
                        $scope.index = 0;

                        if(on === undefined){
                            topbar.toggleClass('expanded');
                        }
                        else if (on === true){
                            topbar.addClass('expanded');
                        }
                        else if (on === false){
                            topbar.removeClass('expanded');
                        }

                        $scope.height = '';


                        if (settings.scrolltop) {
                            if (!topbar.hasClass('expanded')) {
                                if (topbar.hasClass('fixed')) {
                                    topbar.parent().addClass('fixed');
                                    topbar.removeClass('fixed');
                                    body.addClass('f-topbar-fixed');
                                }
                            } else if (topbar.parent().hasClass('fixed')) {
                                topbar.parent().removeClass('fixed');
                                topbar.addClass('fixed');
                                body.removeClass('f-topbar-fixed');
                                $window.scrollTo(0,0);
                            }
                        } else {
                            if(is_sticky(topbar, topbar.parent(), settings)) {
                                topbar.parent().addClass('fixed');
                            }

                            if(topbar.parent().hasClass('fixed')) {
                                if (!topbar.hasClass('expanded')) {
                                    topbar.removeClass('fixed');
                                    topbar.parent().removeClass('expanded');
                                    $scope.update_sticky_positioning();
                                } else {
                                    topbar.addClass('fixed');
                                    topbar.parent().addClass('expanded');
                                    body.addClass('f-topbar-fixed');
                                }
                            }
                        }
                    };

                    win.bind('resize', function(){
                        var sections = angular.element(topbar[0].querySelectorAll('section'));
                        angular.forEach(sections, function(section){
                            angular.element(section.querySelectorAll('li.moved')).removeClass('moved');
                        });
                        topbar.removeClass('expanded');
                        $scope.height = '';
                        $scope.$apply();
                    });

                    if(topbarContainer.hasClass('fixed') || is_sticky(topbar, topbarContainer, settings) ) {
                        settings.sticky_class = settings.sticky_class;
                        settings.sticky_topbar = topbar;
                        $scope.height = topbarContainer[0].offsetHeight;
                        var stickyoffset = topbarContainer[0].getBoundingClientRect().top;
                    } else {
                        $scope.height = topbar[0].offsetHeight;
                    }

                    var topbar_height = $scope.height;

                     $scope.$watch('height', function(h){
                        if(h){
                            topbar.css('height', h + 'px');
                        } else {
                            topbar.css('height', '');
                        }
                    });
                    
                    // Pad body when sticky (scrolled) or fixed.
                    head.append('<style>.f-topbar-fixed { padding-top: ' + topbar_height + 'px }</style>');

                    // Assemble menu structure...
                    var sections = angular.element(topbar[0].querySelectorAll('section'));

                    angular.forEach(sections, function(section){
                        var links = section.querySelectorAll('.has-dropdown>a');
                        var $section = angular.element(section);

                        var names = [];
                        angular.forEach(section.children, function(child){
                            var $child = angular.element(child);
                            if($child.hasClass('name')){
                                names.append();
                            }
                        });

                        if (!rtl) {
                            $scope.$watch('index', function(index){
                                $section.css({left: index * -100 + '%'});
                            });
                            
                            angular.forEach(names, function(name){
                                $scope.$watch('index', function(index){
                                    name.css({left: index * 100 + '%'});
                                });
                            });

                        } else {
                            $scope.$watch('index', function(index){
                                $section.css({right: index * -100 + '%'});
                            });
                            
                            angular.forEach(names, function(name){
                                $scope.$watch('index', function(index){
                                    name.css({right: index * 100 + '%'});
                                });
                            });
                            
                        }

                        angular.forEach(links, function(link){
                            var dropdowns = section.querySelectorAll('.dropdown');
                            var $link = angular.element(link);
                            var url = $link.attr('href');

                            $link.bind('click', function(event){
                                $scope.forward(event);
                                $scope.$apply();
                            });
                            $scope.$on('$destroy', function(){
                                $link.unbind('click');
                            });
                            //$link.attr('ng-click', 'forward($event)');
                            //$compile($link)($scope);

                            angular.forEach(dropdowns, function(dropdown){
                                var $dropdown = angular.element(dropdown);
                                var backs = dropdown.querySelectorAll('.title.back');
     
                                if(!backs.length){
                                    var back_text;
                                    if (settings.custom_back_text === true) {
                                        back_text = settings.back_text;
                                    } else {
                                        back_text = '&laquo; ' + $link.html();
                                    }

                                    var $titleLi;
                                    if (settings.mobile_show_parent_link && url && url.length > 1) {
                                        $titleLi = angular.element('<li class="title back js-generated">' +
                                            '<h5><a href="#" ng-click="back($event);">' + back_text + '</a></h5></li>' +
                                            '<li><a class="parent-link js-generated" href="' +
                                            url + '">' + $link.text() +'</a></li>');
                                    } else {
                                        $titleLi = angular.element('<li class="title back js-generated">' +
                                            '<h5><a href="" ng-click="back($event);">' + back_text + '</a></h5></li>');
                                    }

                                    $compile($titleLi)($scope);
                                    $dropdown.prepend($titleLi);
                                }
                            });

                        });

                        // make links close menu on click
                        var links2 = section.querySelectorAll('li a');
                        angular.forEach(links2, function(link){
                            var $link = angular.element(link);
                            var li = $link.closest('li');
                            if(li.hasClass('has-dropdown') || li.hasClass('back') || li.hasClass('title')){
                                return;
                            }

                            $link.bind('click', function(){
                                $scope.toggle(false);
                                $scope.$apply();
                            });
                        });

                    });

                    //var titlebar = angular.element(sections).children().filter('ul').first();
                    
                    $scope.update_sticky_positioning = function(){
                        var klass = '.' + settings.sticky_class;
 
                        if (!settings.sticky_topbar || !is_sticky(topbar, topbar.parent(), settings)) {
                            return;
                        }
                        
                        var $klass = angular.element($document[0].querySelector(klass));

                        var distance = stickyoffset;
                        if (true) {
                            if (win.scrollTop() > (distance)) {
                                if (!$klass.hasClass('fixed')) {
                                    $klass.addClass('fixed');
                                    body.addClass('f-topbar-fixed');
                                }
                            } else if (win.scrollTop() <= distance) {
                                if ($klass.hasClass('fixed')) {
                                    $klass.removeClass('fixed');
                                    body.removeClass('f-topbar-fixed');
                                }
                            }
                        }  
                    };

                    // update sticky positioning
                    win.bind("scroll", function() {
                        $scope.update_sticky_positioning();
                        $scope.$apply();
                    });

                    $scope.$on('$destroy', function(){
                        win.unbind("scroll");
                    });

                    if (topbarContainer.hasClass('fixed')) {
                        body.addClass('f-topbar-fixed');
                    }
                };
            },
            controller: ['$window', '$scope', function($window, $scope) {
                
                this.breakpoint = breakpoint;
                this.scope = $scope;

                this.toggle = function(){
                    var topbar = $scope.topbar;
                    var settings = $scope.settings;

                    var section = angular.element(
                        topbar[0].querySelectorAll('section, .section')
                        );

                    $scope.toggle();

                    $scope.$apply();

                };

            }]
        };
    }])
    .directive('hasDropdown', [function () {
        return {
            scope: {},
            require: '^topBar',
            restrict: 'C',
            link: function ($scope, element, attrs, topBar) {
                element.bind('mouseenter', function() {
                    if(topBar.scope.settings.is_hover && !topBar.breakpoint()){
                        element.addClass('not-click');
                    }
                });
                element.bind('click', function(event) {
                    if(!topBar.scope.settings.is_hover && !topBar.breakpoint()){
                        element.toggleClass('not-click');
                    }
                });
                
                element.bind('mouseleave', function() {
                    element.removeClass('not-click');
                });

                $scope.$on('$destroy', function(){
                    element.unbind('click');
                    element.unbind('mouseenter');
                    element.unbind('mouseleave');
                });

            }
        };
    }])

    .directive('toggleTopbar', [function () {
        return {
            scope: {},
            require: '^topBar',
            restrict: 'C',
            link: function ($scope, element, attrs, topBar) {
                element.bind('click', function(event) {
                    var li = angular.element(event.currentTarget).closest('li');
                    if(topBar.breakpoint() && !li.hasClass('back') && !li.hasClass('has-dropdown')) {
                        topBar.toggle();
                    }
                });

                $scope.$on('$destroy', function(){
                    element.unbind('click');
                });
            }
        };
    }]);
