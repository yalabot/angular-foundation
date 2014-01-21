A `$tour` service to give users of your website or app a tour when they
visit. It works in conjunction with a `step` directive. This is the equivalent
of the [Foundation Joyride](http://foundation.zurb.com/docs/components/joyride.html) component.

The step directive **requires** the tooltip module and supports multiple
placements, optional transition animation, and more.

The step directive provides several optional attributes to control how it
will display:

- `step-title`: A string to display as a fancy title.
- `step-placement`: Where to place it? Defaults to "top", but also accepts
  "bottom", "left", "right".
- `step-animation`: Should it fade in and out? Defaults to "true".
- `step-popup-delay`: For how long should the user have to have the mouse
  over the element before the step shows (in milliseconds)? Defaults to 0.
- `step-trigger`: What should trigger the show of the step? See the
  `tooltip` directive for supported values.
- `step-append-to-body`: Should the tooltip be appended to `$body` instead of
  the parent element?

The step directive requires the `$position` service.

The step directive also supports various default configurations through the
$tooltipProvider. See the [tooltip](#tooltip) section for more information.

