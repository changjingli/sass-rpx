# sass-rpx [![Node.js CI](https://github.com/changjingli/sass-rpx/actions/workflows/node.js.yml/badge.svg)](https://github.com/changjingli/sass-rpx/actions/workflows/node.js.yml)

Forked from: [pierreburel/sass-rem](https://github.com/pierreburel/sass-rem)

Sass function and mixin to use rpx units with optional pixel fallback.

Compatibility: [Dart Sass](https://sass-lang.com/dart-sass) only (**use v2.0 for LibSass/node-sass and Ruby Sass**).

PostCSS version: https://github.com/pierreburel/postcss-rem

---

## Installation

Install with [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/):

* `yarn add sass-rpx`
* `npm install sass-rpx`

---

## Usage

Import in your project depending of your setup:

```scss
@use "rpx";
// or @use "~sass-rpx" as rpx;
// or @use "../node_modules/sass-rpx" as rpx;

.demo {
  font-size: rpx.convert(24px); // Simple
  padding: rpx.convert(5px 10px); // Multiple values
  border-bottom: rpx.convert(1px solid black); // Multiple mixed values
  box-shadow: rpx.convert(0 0 2px #ccc, inset 0 0 5px #eee); // Comma-separated values
  // Multiple properties
  @include rpx.convert((
    margin: 10px 5px,
    text-shadow: (1px 1px #eee, -1px -1px #eee) // Parentheses needed because of comma
  ));
}
```

Will output:

```css
.demo {
  font-size: 24rpx;
  padding: 5rpx 10rpx;
  border-bottom: 1rpx solid black;
  box-shadow: 0 0 2rpx #ccc, inset 0 0 5rpx #eee;
  margin: 10rpx 5rpx;
  text-shadow: 1rpx 1rpx #eee, -1rpx -1rpx #eee;
}
```

## *But it was shorter before!*

It was.

But You can change the namespace to something shorter and use `rem` function and mixin instead of `convert`:

```scss
@use "rpx" as to; // Because why not?

.demo {
  font-size: to.rpx(24px);
}
```

Or you can even load the library globally (but beware of conflicts, avoided by the idea of modules):

```scss
@use "rpx" as *;

.demo {
  font-size: rpx(24px);
}
```

And if you just don't want to use Sass Modules, you can still use `@import` with `rem` function, mixin and namespaced `$rem-*` variables as before:

```scss
@import "sass-rpx";
// or @import "~sass-rpx";
// or @import "../node_modules/sass-rpx";

$rpx-baseline: 0.5px;

.demo {
  font-size: rpx(24px);
}
```

---

## Using pixel fallback

You can enable pixel fallback by setting `$fallback` to `true`, but you will have to use the mixin instead of the function. The mixin accepts a map to convert multiple properties at once too:

```scss
@use "rpx" with (
  $fallback: true
);

.demo {
  @include rpx.convert(font-size, 24px); // Simple
  @include rpx.convert(padding, 5px 10px); // Multiple values
  @include rpx.convert(border-bottom, 1px solid black); // Multiple mixed values
  @include rpx.convert(box-shadow, 0 0 2px #ccc, inset 0 0 5px #eee); // Comma-separated values
  // Multiple properties
  @include rpx.convert((
    margin: 10px 5px,
    text-shadow: (1px 1px #eee, -1px -1px #eee) // Parentheses needed because of comma
  ));
}
```

Will output:

```css
.demo {
  font-size: 24px;
  font-size: 24rpx;
  padding: 5px 10px;
  padding: 5rpx 10rpx;
  border-bottom: 1px solid black;
  border-bottom: 1rpx solid black;
  box-shadow: 0 0 2px #ccc, inset 0 0 5px #eee;
  box-shadow: 0 0 2rpx #ccc, inset 0 0 5rpx #eee;
  margin: 10px 5px;
  margin: 10rpx 5rpx;
  text-shadow: 1px 1px #eee, -1px -1px #eee;
  text-shadow: 1rpx 1rpx #eee, -1rpx -1rpx #eee;
}
```

---

You can totally disable rpx units by setting `$px-only` to `true` (for a lt-ie9 only stylesheet for example):

```css
.demo {
  font-size: 24px;
  padding: 5px 10px;
  border-bottom: 1px solid black;
  box-shadow: 0 0 2px #ccc, inset 0 0 5px #eee;
  margin: 10px;
  text-shadow: 1px 1px #eee, -1px -1px #eee;
}
```

---

## Changing baseline

By default, sass-rem now uses a 16px baseline, but you can change this value with `$baseline` and by using the `baseline` mixin on the html element to adjust the root font size. The `rem` function and mixin will calculate rem values accordingly.
For example, you can set `$baseline` to 10px to have a root font size of 62.5% and improve readability (10px = 1rem), which was the pre-2.0 behavior:

```scss
@use "rpx" with (
  $baseline: .5px
);

.demo {
  font-size: rpx.convert(24px);
}
```

Will output:

```css

.demo {
  font-size: 48rpx;
}
```

---