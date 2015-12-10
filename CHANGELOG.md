<a name="v0.9.0"></a>
# v0.9.0 (unreleased)
## Bug Fixes
* **topbar**
  - Fix incorrect unbinding of resize and scroll events on destroy ([#283](https://github.com/pineconellc/angular-foundation/pull/283))

<a name="v0.8.0"></a>
# v0.8.0 (2015-10-13)
## Features
* **modal**
  - Adds the `parent` option to override where the modal HTML is injected into. ([#270](https://github.com/pineconellc/angular-foundation/pull/270))
  - Adds a `$modalInstance.reposition()` function to recalculate and reposition the modal window. ([#274](https://github.com/pineconellc/angular-foundation/pull/274))

## Bug Fixes
* **modal**
  - Prevents a crash when `dismiss()` or `close()` are called on a closed modal. ([#260](https://github.com/pineconellc/angular-foundation/pull/260))

## Other
* **all**
  - Drop advertised support for IE9.
* **dropdownToggle**
  - Add `f-open-dropdown` class to opened dropdown content. ([#263](https://github.com/pineconellc/angular-foundation/pull/263))

<a name="v0.7.0"></a>
# v0.7.0 (2015-09-25)
## Features
* **all**
  - Support for Angular 1.4. Angular 1.3 support remains but support for Angular 1.2 has been dropped. ([#265](https://github.com/pineconellc/angular-foundation/pull/265))
* **tabs**
  - Add an option to not select a tab on initial load. ([#196](https://github.com/pineconellc/angular-foundation/pull/196))

## Bug Fixes
* **typeahead**
  - Ensure that the `typeahead-loading` expression is always set to false after asynchronous loads. ([#210](https://github.com/pineconellc/angular-foundation/pull/210))

## Other
* **accordion**
  - Use Foundation's `active` class for the open accordion section. ([#228](https://github.com/pineconellc/angular-foundation/pull/228))

<a name="v0.6.0"></a>
# v0.6.0 (2015-04-13)
## Features
* **dropdownToggle**
  - Add 'expanded' class when toggled
* **modal**
  - Add `controllerAs` option. ([#176](https://github.com/pineconellc/angular-foundation/pull/176))

## Bug Fixes
* **modal**
  - Fixes focus on model open
* **tour**
  - Fixes an issue where tour would stay open when location changed
  - Prevents a SecurityError from being raised when accessing localStorage
* **topbar**
  - Fix event unbinding
  - Fix sticky topbar when page is refreshed. ([#213](https://github.com/pineconellc/angular-foundation/issues/213))

<a name="v0.5.1"></a>
# v0.5.1 (2014-11-29)
## Bug Fixes
* **topbar and modal**
  - Fixes an issue where page offset would not be calculated correctly in IE. ([#151](https://github.com/pineconellc/angular-foundation/pull/151))

<a name="v0.5.0"></a>
# v0.5.0 (2014-11-20)
## Bug Fixes
* **dropdownToggle**
  - Fixes an issue where a dropdown within a topbar would not display properly. ([#153](https://github.com/pineconellc/angular-foundation/issues/153))
  - Unbind click handler on `$destroy` ([095a0d4](https://github.com/pineconellc/angular-foundation/commit/095a0d4dc191cf548276ade38dd5202125dae93d))
* **tabs**
  - Fixes an issue where the active attribute would not be set properly ([#125](https://github.com/pineconellc/angular-foundation/pull/125))
* **modal**
  - Destroy modal scope on close ([#139](https://github.com/pineconellc/angular-foundation/pull/139))

## Features
* **all**
  - Angular 1.3 support ([#144](https://github.com/pineconellc/angular-foundation/pull/144))

## Other
* **all**
  - Add editorconfig ([#134](https://github.com/pineconellc/angular-foundation/pull/134))
  - Upgrade Karma to 0.12.x
  - Use bower to pull in test dependencies ([#149](https://github.com/pineconellc/angular-foundation/pull/149) and [#154](https://github.com/pineconellc/angular-foundation/pull/154))
* **tabs**
  - Improved tests ([#132](https://github.com/pineconellc/angular-foundation/pull/132))

<a name="v0.4.0"></a>
# v0.4.0 (2014-10-15)
## Bug Fixes
* **modal**
  - Fixes an issue where modal input elements could not be focused if ngTouch was enabled. ([c359d0b](https://github.com/pineconellc/angular-foundation/commit/c359d0bc4b61d6d5b9a4c1a516443231f334e91f))
  - Fixes the size of modals with overflowing content. ([#87](https://github.com/pineconellc/angular-foundation/pull/89))
* **tooltip**
  - Fix unregistering of dynamic tooltip triggers ([fdc2df9](https://github.com/pineconellc/angular-foundation/commit/fdc2df9ebcc00edc04d11abf4d018f7ef6a5b269))
* **dropdownToggle**
  - Improved behavior for small screens
  - Fix overflow

## Features
* **mediaQueries**
  - Extracted `mediaQueries` factory into its own module so it can be reused. ([#99](https://github.com/pineconellc/angular-foundation/pull/99))
* **accordion**
  - Add active class to the open accordion segment ([27e787f](https://github.com/pineconellc/angular-foundation/commit/27e787fad563f70cae79e6c57077daa563a2e8e2))

<a name="v0.3.1"></a>
# v0.3.1 (2014-08-19)
## Bug Fixes
* **topbar**
  - Fix reference to non-existant topBarSection controller on destroy
  - Use `$window.scrollY` instead of `scrollTop()` for sticky
  - Fix resize when breakpoint doesn't change (fixes #85)
* **typeahead**
  - Fixes non-interactive dropdown opening for asynchronous data
* **modal**
  - Fix autofocus elements on model opening

## Other
* The angular-foundation project has moved from Mad Mimi to Pinecone so references have been updated.

<a name="v0.3.0"></a>
# v0.3.0 (2014-07-14)

## Features
* **topbar:**
  - New `topbar` component
* **interchange:**
  - New `interchange` component

<a name="v0.2.2"></a>
# v0.2.2 (2014-05-28)
## Bug Fixes
* **tour:** Fix tour. It was broken when its primary directive was renamed to `step-text`. ([f92ddf3](https://github.com/pineconellc/angular-foundation/commit/f92ddf3b8ea16da762fef1ee4f854ab864d255e3), closes [#50](http://github.com/pineconellc/angular-foundation/issues/50))
* **tour:** Added some basic specs for tour. ([b4ee50fa2](https://github.com/pineconellc/angular-foundation/commit/b4ee50fa268d8578d836b898dc6d19015bf1526f))

<a name="v0.2.1"></a>
# v0.2.1 (2014-05-20)
## Bug Fixes

* **dropdownToggle:** Fix issue with prevent event defaults. ([49a079c5](http://github.com/pineconellc/angular-foundation/commit/49a079c54c15cd5db04fa3c1bbdf435c4bdd390c), closes [#47](http://github.com/pineconellc/angular-foundation/issues/47))

# 0.2.0 (2014-05-05)

## Features

- **offcanvas:**
  - New offcanvas component ([1f6f3bd9](http://github.com/pineconellc/angular-foundation/commit/1f6f3bd9))

## Bug Fixes

- **all:**
  - fix plunker ([aebade40](http://github.com/pineconellc/angular-foundation/commit/aebade40))  
- **dropdownToggle:**
  - Refactor test and fix initial hiding of dropdown target ([26e8c5a0](http://github.com/pineconellc/angular-foundation/commit/26e8c5a0))  
- **offcanvas:**
  - Removed unused isolated scopes that may conflict with other diretives. ([980624cf](http://github.com/pineconellc/angular-foundation/commit/980624cf))  
  - Fix spec ([0fe989ad](http://github.com/pineconellc/angular-foundation/commit/0fe989ad))

<a name="0.1.0"></a>
## 0.1.0 (2014-02-06)


#### Features

* **accordion:** add accordion component ([5b9998cd](pineconellc/angular-foundation/commit/5b9998cda6b6e94d67df5351fdd1f7978a72d552))
* **pagination:** add pagination component ([7e8b8a57](pineconellc/angular-foundation/commit/7e8b8a57850039b90dfe3dfe497691a0db035bfa))
* **rating:** add rating component ([ba4cc60f](pineconellc/angular-foundation/commit/ba4cc60fefee9671ec783e163157fa66ea04616e))
* **typeahead:** add typeahead component ([4ef37f87](pineconellc/angular-foundation/commit/4ef37f8763a21ced9a7cc774acd3ed055b4c6236))


<a name="0.2.0"></a>
## 0.0.0 (2014-01-23)


#### Bug Fixes

* **alert:** properly close  tag ([3be291e0](pineconellc/angular-foundation/commit/3be291e0671cb74c3ed22ec95fbfeb54a5f1559b))
* **dropdown:**
  * add position module as dependency to dropdown ([7f6aa800](pineconellc/angular-foundation/commit/7f6aa800c2b3b69bc2dce72c7ff6598afe003f7b))
  * properly set display none ([7e6837c1](pineconellc/angular-foundation/commit/7e6837c19be64dea3a51aff629d3dc7d99fe5096))
  * ng-hide is not compatible with dropdowns in menus ([112c367f](pineconellc/angular-foundation/commit/112c367f5270107fc1aedfceb7d128529ac96776))
* **modal:** close the modal on backdrop click ([df895117](pineconellc/angular-foundation/commit/df89511775a0b72204f3edc78b53211e51547838))


#### Features

* **alert:** convert the alert component ([a5d6b722](pineconellc/angular-foundation/commit/a5d6b722dd43d26304852daad1fe6498e0e53091))
* **dropdown:**
  * use text binding for dropdownToggle scope property ([deaada51](pineconellc/angular-foundation/commit/deaada51b67b3f0c8822714f55d00e2d2365404b))
  * convert the dropdown component ([439a587c](pineconellc/angular-foundation/commit/439a587c9025ce37552d0df80fa92687c8ebcf11))
* **modal:** convert the modal component ([e225039e](pineconellc/angular-foundation/commit/e225039ec27e55424d8b4e696aa4c34675026c63))
* **popover:**
  * use P tag for content ([4fcc0be0](pineconellc/angular-foundation/commit/4fcc0be0383c6e3e56413a4ab3665f8584071438))
  * use H4 for title and remove Bootstrap classes ([67508d72](pineconellc/angular-foundation/commit/67508d72f4c8df1c24c578c49154ea4b28884343))
  * convert the popover component ([ec82ad0b](pineconellc/angular-foundation/commit/ec82ad0b4ebd0f2ab3e7584272f96642a5f65931))
* **progressBar:** convert progress bar ([89caee33](pineconellc/angular-foundation/commit/89caee33f1ff1aa6370b7032cdec4fa54a149f86))
* **tabs:** convert the tabs component to Foundation style ([3d34ac80](pineconellc/angular-foundation/commit/3d34ac8033d1cd4b8e7835f332f47de94847c141))
* **tooltip:** convert the tooltip component ([ff636233](pineconellc/angular-foundation/commit/ff636233ec453a74512515ea426a7a90ec35d1bb))
* **tour:** add tour component ([4af89393](pineconellc/angular-foundation/commit/4af89393f63bd2e5be6e592dc100c0ca006fa5e5))
