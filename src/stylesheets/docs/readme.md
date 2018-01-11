The `stylesheet` module lets you manipulate `<style>` DOM nodes easily. The module provides a `stylesheetFactory` that you can use to for example create new style tags:

```js
function(stylesheetFactory) {
    var sheet = stylesheetFactory();
    sheet.css('h1::before', {
        'background-color': 'green',
        color: 'red'
    });

    // Write changes to DOM
    sheet.sync();

    // Get the Angular Element
    $sheet = sheet.element();
};
```

`stylesheetFactory` takes either an *angular.element*, or null to create a new `style` element.
A `stylesheet` provides the following API:

* `css(selector, rules)` - Set or change rules for a given selector. *Selector* can be any arbitrary, valid CSS selector. *Rules* is an object of *rule*: *value*.
* `sync()` - Syncs the sheet to the DOM. If the sheet is empty, the element will be removed from the DOM.
* `element` - Get the angular.element
