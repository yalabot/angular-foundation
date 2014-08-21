angular.module("mm.foundation.mediaQueries", [])
    .factory('matchMedia', ['$document', '$window', function($document, $window) {
        // MatchMedia for IE <= 9
        return $window.matchMedia || (function matchMedia(doc, undefined){
            var bool,
                docElem = doc.documentElement,
                refNode = docElem.firstElementChild || docElem.firstChild,
                // fakeBody required for <FF4 when executed in <head>
                fakeBody = doc.createElement("body"),
                div = doc.createElement("div");

            div.id = "mq-test-1";
            div.style.cssText = "position:absolute;top:-100em";
            fakeBody.style.background = "none";
            fakeBody.appendChild(div);

            return function (q) {
                div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";
                docElem.insertBefore(fakeBody, refNode);
                bool = div.offsetWidth === 42;
                docElem.removeChild(fakeBody);
                return {
                    matches: bool,
                    media: q
                };
            };

        }($document[0]));
    }])
    .factory('mediaQueries', ['$document', 'matchMedia', function($document, matchMedia) {
        var head = angular.element($document[0].querySelector('head'));
        head.append('<meta class="foundation-mq-topbar" />');
        head.append('<meta class="foundation-mq-small" />');
        head.append('<meta class="foundation-mq-medium" />');
        head.append('<meta class="foundation-mq-large" />');

        var regex = /^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g;
        var queries = {
            topbar: getComputedStyle(head[0].querySelector('meta.foundation-mq-topbar')).fontFamily.replace(regex, ''),
            small : getComputedStyle(head[0].querySelector('meta.foundation-mq-small')).fontFamily.replace(regex, ''),
            medium : getComputedStyle(head[0].querySelector('meta.foundation-mq-medium')).fontFamily.replace(regex, ''),
            large : getComputedStyle(head[0].querySelector('meta.foundation-mq-large')).fontFamily.replace(regex, '')
        };

        return {
            topbarBreakpoint: function () {
                return !matchMedia(queries.topbar).matches;
            },
            small: function () {
                return matchMedia(queries.small).matches;
            },
            medium: function () {
                return matchMedia(queries.medium).matches;
            },
            large: function () {
                return matchMedia(queries.large).matches;
            }
        };
    }]);
