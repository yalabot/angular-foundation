Interchange uses media queries to dynamically load responsive content that is appropriate for different users' browsers.

Using Interchange with different contents:

 - *HTML templates* by linking a rule with html files to a `div` tag
 - *Images* by an interchange rule to an `img` tag
 - *Background-images* by linking a rule with picture files to a `div` tag

Custom named queries are available via the method `add` of the factory `interchangeQueriesManager`. You just need to provide the name and media type desired.

Like the original, `replace` events are available when an interchange element switch to another media query.