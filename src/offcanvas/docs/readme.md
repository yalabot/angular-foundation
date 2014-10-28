A lightweight directive that provides the [Foundation Offcanvas](http://foundation.zurb.com/docs/components/offcanvas.html) component.

There are no settings. You simply need to include the foundation off canvas CSS component in your page.

The off canvas module expects the use of several nested elements with the following classes:

- `off-canvas-wrap`: The most outter page wrapper.
- `inner-wrap`: Second page wrapper nested directly inside off-canvas-wrap.
- `left-off-canvas-toggle`: Wraps the left off canvas menu.
- `right-off-canvas-toggle`: Wraps the right off canvas menu.
- `exit-off-canvas`: Occludes the main page content when an off canvas menu is visible. Hides the menu when clicked.
- `off-canvas-list`: Contains off canvas menu items.
- At default the menu hides after a nested link is clicked. Set the `close-on-click` attribute to false to prevent this action. You can reference a scope variable, too.

See the demo page for example on how to use this and see the [Foundation docs](http://foundation.zurb.com/docs/components/offcanvas.html) for more details.
