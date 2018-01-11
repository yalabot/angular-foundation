Rating directive that will take care of visualising a star rating bar.

It uses Font Awesome icons (http://fontawesome.io/) by default.

### Settings ###

#### `<rating>` ####

 * `ng-model` <i class="fa fa-eye"></i>
 	:
 	The current rate.

 * `max`
 	_(Defaults: 5)_ :
 	Changes the number of icons.

 * `readonly` <i class="fa fa-eye"></i>
 	_(Defaults: false)_ :
 	Prevent user's interaction.

 * `titles`
 	_(Defaults: ["one", "two", "three", "four", "five"])_ :
 	An array of Strings defining titles for all icons

 * `on-hover(value)`
 	:
 	An optional expression called when user's mouse is over a particular icon.

 * `on-leave()`
 	:
 	An optional expression called when user's mouse leaves the control altogether.

 * `state-on`
 	_(Defaults: null)_ :
 	A variable used in template to specify the state (class, src, etc) for selected icons.

 * `state-off`
 	_(Defaults: null)_ :
 	A variable used in template to specify the state for unselected icons.

 * `rating-states`
 	_(Defaults: null)_ :
 	An array of objects defining properties for all icons. In default template, `stateOn` & `stateOff` property is used to specify the icon's class.
