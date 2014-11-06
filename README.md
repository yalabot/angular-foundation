# Angular Components for [Foundation](http://foundation.zurb.com/)
[![Build Status](https://semaphoreapp.com/api/v1/projects/670cabb5-3c50-4197-9df5-e75cf62c9d20/237671/badge.png)](https://semaphoreapp.com/pinecone/angular-foundation)
[![Latest Version](https://badge.fury.io/bo/angular-foundation.svg)](https://github.com/pineconellc/angular-foundation-bower)
***

This project is a port of the AngularUI team's excellent [angular-bootstrap](https://github.com/angular-ui/bootstrap) project for use in the [Foundation](http://foundation.zurb.com/) framework.

## Demo

Do you want to see this in action? Visit http://pineconellc.github.io/angular-foundation/

## Installation

Installation is easy as angular-mm-foundation has minimal dependencies - only the AngularJS and Foundation's CSS are required.
After downloading dependencies (or better yet, referencing them from your favourite CDN) you need to download build version of this project. All the files and their purposes are described here: 
https://github.com/pineconellc/angular-foundation/tree/gh-pages
Don't worry, if you are not sure which file to take, opt for `mm-foundation-tpls-[version].min.js`.

When you are done downloading all the dependencies and project files the only remaining part is to add dependencies on the `mm.foundation` AngularJS module:

```javascript
angular.module('myModule', ['mm.foundation']);
```

## Supported Foundation components

* Split Buttons
* Reveal Modal
* Alerts
* Joyride
* Dropdowns
* Tabs
* Offcanvas
* Interchange

We'd gladly accept contributions for any remaining components.

## Supported Browsers 

Directives **should** work with the following browsers:

* Chrome (stable and canary channel)
* Firefox
* IE 9 and 10
* Opera
* Safari

Modern mobile browsers should work without problems.

**IE 8 is not officially supported at the moment**. This project is run by volunteers and with the current number of commiters
we are not in the position to guarantee IE8 support. If you need support for IE8 we would welcome a contributor who would like to take care about IE8.
Alternativelly you could sponsor this project to guarantee IE8 support.

We believe that most of the directives would work OK after:
* including relevant shims (for ES5 we recommend https://github.com/kriskowal/es5-shim)
* taking care of the steps described in http://docs.angularjs.org/guide/ie

We are simply not regularly testing against IE8.

## Project philosophy

### Native, lightweight directives

We are aiming at providing a set of AngularJS directives based on Foundation's markup and CSS. The goal is to provide **native AngularJS directives** without any dependency on jQuery or Foundation's JavaScript.
It is often better to rewrite an existing JavaScript code and create a new, pure AngularJS directive. Most of the time the resulting directive is smaller as compared to the orginal JavaScript code size and better integrated into the AngularJS ecosystem.

### Customizability

All the directives in this repository should have their markup externalized as templates (loaded via `templateUrl`). In practice it means that you can **customize directive's markup at will**. One could even imagine providing a non-Foundation version of the templates!

### Take what you need and not more

Each directive has its own AngularJS module without any dependencies on other modules or third-pary JavaScript code. In practice it means that you can **just grab the code for the directives you need** and you are not obliged to drag the whole repository.

### Quality and stability

**Note:** Full test coverage is pending

Directives should work. All the time and in all browsers. This is why all the directives have a comprehensive suite of unit tests. All the automated tests are executed on each checkin in several browsers: Chrome, ChromeCanary, Firefox, Opera, Safari, IE9.
In fact we are fortunate enough to **benefit from the same testing infrastructure as AngularJS**!

## Contributing to the project

We are always looking for the quality contributions! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution guidelines.

### Development
#### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install global dev dependencies: `npm install -g grunt-cli karma`
* Instal local dev dependencies: `npm install` while current directory is foundation repo

#### Build
* Build the whole project: `grunt` - this will run `lint`, `test`, and `concat` targets
* To build modules, first run `grunt html2js` then `grunt build:module1:module2...:moduleN`

You can generate a custom build, containing only needed modules, from the project's homepage.
Alternativelly you can run local Grunt build from the command line and list needed modules as shown below:

```
grunt build:modal:tabs:alert:popover:dropdownToggle:buttons:progressbar
```

Check the Grunt build file for other tasks that are defined for this project.

#### TDD
* Run test: `grunt watch`
 
This will start Karma server and will continously watch files in the project, executing tests upon every change.

#### Test coverage
Add the `--coverage` option (e.g. `grunt test --coverage`, `grunt watch --coverage`) to see reports on the test coverage. These coverage reports are found in the coverage folder.

### Customize templates

As mentioned directives from this repository have all the markup externalized in templates. You might want to customize default
templates to match your desired look & feel, add new functionality etc.

The easiest way to override an individual template is to use the `<script>` directive:

```javascript
<script id="template/alert/alert.html" type="text/ng-template">
    <div class='alert' ng-class='type && "alert-" + type'>
        <button ng-show='closeable' type='button' class='close' ng-click='close()'>Close</button>
        <div ng-transclude></div>
    </div>
</script>
```

If you want to override more templates it makes sense to store them as individual files and feed the `$templateCache` from those partials.
For people using Grunt as the build tool it can be easily done using the `grunt-html2js` plugin. You can also configure your own template url.
Let's have a look:

Your own template url is `views/partials/mm-foundation-tpls/alert/alert.html`.

Add "html2js" task to your Gruntfile
```
html2js: {
  options: {
    base: '.',
    module: 'ui-templates',
    rename: function (modulePath) {
      var moduleName = modulePath.replace('app/views/partials/mm-foundation-tpls/', '').replace('.html', '');
      return 'template' + '/' + moduleName + '.html';
    }
  },
  main: {
    src: ['app/views/partials/mm-foundation-tpls/**/*.html'],
    dest: '.tmp/ui-templates.js'
  }
}
```

Make sure to load your template.js file
`<script src="/ui-templates.js"></script>`

Inject the `ui-templates` module in your `app.js`
```
angular.module('myApp', [
  'mm.foundation',
  'ui-templates'
]);
```

Then it will work fine!

For more information visit: https://github.com/karlgoldstein/grunt-html2js

### Release
* Bump up version number in `package.json`
* Commit the version change with the following message: `chore(release): [version number]`
* tag
* push changes and a tag (`git push --tags`)
* switch to the `gh-pages` branch: `git checkout gh-pages`
* copy content of the dist folder to the main folder
* Commit the version change with the following message: `chore(release): [version number]`
* push changes
* switch back to the `main branch` and modify `package.json` to bump up version for the next iteration
* commit (`chore(release): starting [version number]`) and push
* publish Bower and NuGet packages

Well done! (If you don't like repeating yourself open a PR with a grunt task taking care of the above!)

## Credits

Again, many thanks to the AngularUI team for the angular-bootstrap project.
