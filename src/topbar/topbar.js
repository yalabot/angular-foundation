angular.module("mm.foundation.topbar", [])
    .run(['$window', '$document', function($window, $document) { // provider-injector
            // polyfils
        $window.matchMedia = window.matchMedia || (function( doc, undefined ) {

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

        }( $document ));

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
        var head = angular.element(document.querySelector('head'));
        var body = angular.element(document.querySelector('body'));
        var html = $document.find('html');
        var rtl = /rtl/i.test(html.attr('dir'));

        head.append('<meta class="foundation-mq-topbar" />');
        head.append('<meta class="foundation-mq-small" />');
        head.append('<meta class="foundation-mq-medium" />');
        head.append('<meta class="foundation-mq-large" />');

        var media_queries = {
            topbar: angular.element('.foundation-mq-topbar').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            small : angular.element('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            medium : angular.element('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            large : angular.element('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
        };

        var breakpoint = function () {
            return !matchMedia(media_queries['topbar']).matches;
        };

        var small = function () {
            return matchMedia(media_queries['small']).matches;
        };

        var medium = function () {
            return matchMedia(media_queries['medium']).matches;
        };

        var large = function () {
            return matchMedia(media_queries['large']).matches;
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
                        
                        $link = angular.element(event.toElement);
                        $movedLi = $link.closest('li.moved');
                        $previousLevelUl = $movedLi.parent();
                        $scope.index = $scope.index -1;

                        if($scope.index === 0){
                            topbar.css('height', '');
                        } else {
                            $scope.height = topbar_height + $previousLevelUl.outerHeight(true);
                        }

                        $timeout(function () {
                            $movedLi.removeClass('moved');
                        }, 300);
                    };

                    $scope.forward = function(event) {
                        if(!breakpoint()){
                            return false;
                        }

                        $link = angular.element(event.toElement);
                        $selectedLi = $link.closest('li');
                        $selectedLi.addClass('moved');
                        $scope.height = topbar_height + $link.siblings('ul').outerHeight(true);
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

                        topbar.css('height', '');
                        
                    };

                    if(topbarContainer.hasClass('fixed') || is_sticky(topbar, topbarContainer, settings) ) {
                        settings.sticky_class = settings.sticky_class;
                        settings.sticky_topbar = topbar;
                        $scope.height = topbarContainer.outerHeight();
                        var stickyoffset = topbarContainer.offset().top;
                    } else {
                        $scope.height = topbar.outerHeight();
                    }

                    var topbar_height = $scope.height;

                    $scope.$watch('height', function(h){
                        topbar.css('height', h);
                    }, true);
                    
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

                            $link.attr('ng-click', 'forward($event)');
                            $compile($link)($scope);

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
                            });
                        });

                    });

                    //var titlebar = angular.element(sections).children().filter('ul').first();
                    
                    // update sticky positioning
                    win.bind("scroll", function() {

                        var klass = '.' + settings.sticky_class;
 
                        if (!settings.sticky_topbar || !is_sticky(topbar, topbar.parent(), settings)) {
                            return;
                        }
                        
                        var $klass = angular.element($document[0].querySelector(klass));

                        var distance = stickyoffset;
                        if (!$klass.hasClass('expanded')) {
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

                    if (settings.scrolltop) {
                        if (!topbar.hasClass('expanded')) {
                            if (topbar.hasClass('fixed')) {
                                topbar.parent().addClass('fixed');
                                topbar.removeClass('fixed');
                                body.addClass('f-topbar-fixed');
                            }
                        } else if (topbar.parent().hasClass('fixed')) {
                            if (settings.scrolltop) {
                                topbar.parent().removeClass('fixed');
                                topbar.addClass('fixed');
                                body.removeClass('f-topbar-fixed');

                                $window.scrollTo(0,0);
                            } else {
                                topbar.parent().removeClass('expanded');
                            }
                        }
                    } else {
                        if(self.is_sticky(topbar, topbar.parent(), settings)) {
                            topbar.parent().addClass('fixed');
                        }

                        if(topbar.parent().hasClass('fixed')) {
                            if (!topbar.hasClass('expanded')) {
                                topbar.removeClass('fixed');
                                topbar.parent().removeClass('expanded');
                                self.update_sticky_positioning();
                            } else {
                                topbar.addClass('fixed');
                                topbar.parent().addClass('expanded');
                                body.addClass('f-topbar-fixed');
                            }
                        }
                    }

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
                    if(topBar.scope.settings.is_hover){
                        element.addClass('not-click');
                    }
                });
                element.bind('click', function(event) {
                    if(!topBar.scope.settings.is_hover){
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
                    var li = angular.element(event.toElement).closest('li');
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