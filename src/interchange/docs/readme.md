Interchange uses media queries to dynamically load responsive content that is appropriate for different screen sizes.

You can use Interchange with different content types:

 - *HTML templates:* by linking a rule with html files to a `div` tag
 - *Images:* through an interchange rule to an `img` tag
 - *Background-images* through linking a rule with picture files to a `div` tag

Custom named queries are available via the method `add` of the `interchangeQueriesManager` factory. You just need to provide the name and media type desired.

Like the original, `replace` events are available when an Interchange element switch to another media query.

For more information, check out [the docs for the original Interchange component](http://foundation.zurb.com/docs/components/interchange.html).

*Images courtesy of the official ZURB Foundation documentation.*