Stylesheets provides the `stylesheetFactory` helper to manipulate *<head>* based stylesheets. It'll allow you to easily inject a new stylesheet and give it a sensible API.

```js
function(stylesheetFactory) {
	// Create a new stylesheet that is auto-appended to <head>
	var sheet = stylesheetFactory();

	// Or load an existing
	var sheet = stylesheetFactory(
		angular.element(document.querySelector('style#id')
	);

	sheet.css('foobar::before', {
		'background-color': 'green',
		color: 'red'
		});

	// Unset a value
	sheet.css('foobar::before', { color: null });

	sheet.sync();

	// Get the element
	var $elem = sheet.element();
}
```
