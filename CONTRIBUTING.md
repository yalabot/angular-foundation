This project would not be possible without your help and support and we appreciate your willingness to contribute!

## Issues

When reporting an issue, please create a demonstration of your issue using [plunker](http://plnkr.co/) or a similar service. We prefer to reserve issue reporting for actual issues. Instead of simply asking for a new feature, why not create it yourself and open a pull request? :wink:

## Pull Requests

Please make sure that your contribution fits according to the project's goals:

  * we are aiming at rebuilding Foundation directives in pure AngularJS, without any dependencies on any external JavaScript library
  * the only dependency should be Foundation CSS and its markup structure
  * behavior should be properly tested
  * directives should be html-agnostic as much as possible which in practice means:
    * templates should be referred to using the `templateUrl` property
    * it should be easy to change a default template to a custom one
    * directives shouldn't manipulate DOM structure directly (when possible)
