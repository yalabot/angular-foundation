A directive that provides the [Foundation Top Bar](http://foundation.zurb.com/docs/components/topbar.html) component.

The directive has virtually identical behavior to Foundation Top Bar. The markup however, is slightly different. The top bar consist of a root ```top-bar``` element with nested ```top-bar-section``` elements that encapsulate menus. The ```title-area``` list is also a direct descendant of the root element. The mobile menu toggle is created by adding the ```toggle-top-bar``` attribute to a ```li``` element inside the title area. Applying ```menu-icon``` class to this element will trigger the icon as determined by the Foundation CSS. ```li``` elements that contain nested menus need to have the ```has-dropdown``` attribute. The nested list itself should have the ```top-bar-dropdown``` attribute.

The following settings can be applied as attributes to the ```top-bar``` element:

- `sticky-class`: Class name that will trigger sticky behavior.
- `custom-back-text`: Set this to false and it will pull the top level link name as the back text.
- `back-text`: Define what you want your custom back text to be if custom-back-text is set.
- `is-hover`: Toggle drop down menus on hover.
- `mobile-show-parent-link`: will copy parent links into dropdowns for mobile navigation.
- `scrolltop`: jump to top when sticky nav menu toggle is clicked

See the demo page for example on how to use this and visit the [Foundation docs](http://foundation.zurb.com/docs/components/topbar.html) for more details.
