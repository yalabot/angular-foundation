Dropdown is a directive which will toggle a dropdown menu on click or
programmatically.

`dropdown`, `dropdownToggle` and `dropdownMenu` are three directives that
work together: The element with a `dropdown` directive should contain an element
marked as `dropdownMenu`, which contains the actual dropdown menu. Optionally,
a `dropdownToggle` element may be added to the `dropdown` element as well.
Clicking that element will toggle the menu's visibility. If no `dropdownToggle`
element is present, the menu can be toggled programmatically using `is-open`.

There is also the `on-toggle(open)` optional expression fired when dropdown
changes state.
