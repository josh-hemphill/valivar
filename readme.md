# Valivar

Mostly derived from [eivindfjeldstad/validate](https://github.com/eivindfjeldstad/validate); Valivar provides dynamic schemas for modern javascript and typescript validation and sanitization. In Valivar you can use catch-all keys `$` and `*` to define any array or object respectively, letting you define a single schema that can apply consistent rules for growing and changing datasets.

<br />

[![version](https://img.shields.io/github/v/tag/josh-hemphill/valivar?sort=semver&style=flat-square)](https://github.com/josh-hemphill/valivar/releases)
[![NPM](https://img.shields.io/static/v1?label=&message=NPM&color=informational&style=flat-square)](https://npmjs.org/package/valivar)
[![Deno](https://img.shields.io/static/v1?label=&message=Deno&color=informational&style=flat-square)](https://deno.land/x/valivar/mod.ts)
[![API doc](https://img.shields.io/static/v1?label=Deno&message=API-Doc&color=informational&style=flat-square)](https://doc.deno.land/https/deno.land/x/valivar/mod.ts)
[![docs](https://img.shields.io/static/v1?label=&message=Docs&color=informational&style=flat-square)](https://josh-hemphill.github.io/valivar/#/)
[![Build Status](https://img.shields.io/travis/josh-hemphill/valivar.svg?style=flat-square)](https://travis-ci.org/josh-hemphill/valivar)
[![Codecov](https://img.shields.io/codecov/c/github/josh-hemphill/valivar.svg?style=flat-square)](https://codecov.io/gh/josh-hemphill/valivar)
[![dependencies](https://img.shields.io/david/josh-hemphill/valivar?label=dep&style=flat-square)](https://david-dm.org/josh-hemphill/valivar)

## Install

### Node.js or Browser

```bash
npm install valivar
```

### Deno

```js
import valivar from "https://deno.land/x/valivar/mod.ts"
```

### Import in HTML

```html
<script type="text/javascript" src="dist/valivar.js"></script>
```

### From CDN

```html
<script type="text/javascript" src="https://unpkg.com/valivar"></script>
```

## Examples

For a full list see the [examples directory](./example/) (coming)

### Play with it

[CodePen (suggested)](https://codepen.io/josh-hemphill/pen/Rwaxbor/left/?editors=1010)

[JSFiddle](https://jsfiddle.net/josh_hemphill/1vf3cb6L/)

## Reademe rewrite in progress...

## Usage

Define a schema and call `.validate()` with the object you want to validate.
The `.validate()` function returns an array of validation errors.

```js
import { Schema } from 'valivar'

const user = new Schema({
  username: {
    type: String,
    required: true,
    length: { min: 3, max: 32 }
  },
  pets: [{
    name: {
      type: String
      required: true
    },
    animal: {
      type: String
      enum: ['cat', 'dog', 'cow']
    }
  }],
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
    zip: {
      type: String,
      match: /^[0-9]+$/,
      required: true
    }
  }
})

const errors = user.validate(obj)
```

Each error has a `.path`, describing the full path of the property that failed validation, and a `.message` describing the error.

```js
errors[0].path //=> 'address.street'
errors[0].message //=> 'address.street is required.'
```

### Custom error messages

You can override the default error messages by passing an object to `Schema.message()`.

```js
const post = new Schema({
  title: { required: true }
})

post.message({
  required: (path) => `${path} can not be empty.`
})

const [error] = post.validate({})
assert(error.message = 'title can not be empty.')
```

It is also possible to define messages for individual properties:

```js
const post = new Schema({
  title: {
    required: true,
    message: 'Title is required.'
  }
})
```

And for individual validators:

```js
const post = new Schema({
  title: {
    type: String,
    required: true,
    message: {
      type: 'Title must be a string.',
      required: 'Title is required.'
    }
  }
})
```

### Nesting

Objects and arrays can be nested as deep as you want:

```js
const event = new Schema({
  title: {
    type: String,
    required: true
  },
  participants: [{
    name: String,
    email: {
      type: String,
      required: true
    },
    things: [{
      name: String,
      amount: Number
    }]
  }]
})
```

Arrays can be defined implicitly, like in the above example, or explicitly:

```js
const post = new Schema({
  keywords: {
    type: Array,
    each: { type: String }
  }
})
```

Array elements can also be defined individually:

```js
const user = new Schema({
  something: {
    type: Array,
    elements: [
      { type: Number },
      { type: String }
    ]
  }
})
```

Nesting also works with schemas:

```js
const user = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

const post = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: user
})
```

If you think it should work, it probably works.

#### Naming conflicts

Validate will naively assume that a nested object where _all_ property names are validators is not a nested object.

```js
const schema = new Schema({
  pet: {
    type: {
      required: true,
      type: String,
      enum: ['cat', 'dog']
    }
  }
});
```

In this example, the `pet.type` property will be interpreted as a `type` rule, and the validations will not work as intended. To work around this we could use the slightly more verbose `properties` rule:

```js
const schema = new Schema({
  pet: {
    properties: {
      type: {
        required: true,
        type: String,
        enum: ['cat', 'dog']
      }
    }
  }
});
```

In this case the `type` property of `pets.properties` will be interpreted as a nested property, and the validations will work as intended.

### Custom validators

Custom validators can be defined by passing an object with named validators to `.use`:

```js
const hexColor = val => /^#[0-9a-fA-F]$/.test(val)

const car = new Schema({
  color: {
    type: String,
    use: { hexColor }
  }
})
```

Define a custom error message for the validator:

```js
car.message({
  hexColor: path => `${path} must be a valid color.`
})
```

### Custom types

Pass a constructor to `.type` to validate against a custom type:

```js
class Car {}

const user = new Schema({
  car: { type: Car }
})
```

### Chainable API

If you want to avoid constructing large objects, you can add paths to a schema by using the chainable API:

```js
const user = new Schema()

user
  .path('username').type(String).required()
  .path('address.zip').type(String).required()
```

Array elements can be defined by using `$` as a placeholder for indices:

```js
const user = new Schema()
user.path('pets.$').type(String)
```

This is equivalent to writing

```js
const user = new Schema({ pets: [{ type: String }]})
```

### Typecasting

Values can be automatically typecast before validation.
To enable typecasting, pass an options object to the `Schema` constructor with `typecast` set to `true`.

```js
const user = new Schema(definition, { typecast: true })
```

You can override this setting by passing an option to `.validate()`.

```js
user.validate(obj, { typecast: false })
```

To typecast custom types, you can register a typecaster:

```js
class Car {}

const user = new Schema({
  car: { type: Car }
})

user.typecaster({
  Car: (val) => new Car(val)
})
```

### Property stripping

By default, all values not defined in the schema will be stripped from the object.
Set `.strip = false` on the options object to disable this behavior. This will likely be changed in a future version.

### Strict mode

When strict mode is enabled, properties that are not defined in the schema will trigger a validation error. Set `.strict = true` on the options object to enable strict mode.

## API
