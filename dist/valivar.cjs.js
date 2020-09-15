'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/***************************************************************************************
*    Title: eivindfjeldstad/dot
*    Author: Eivind Fjeldstad
*    Date: August 28, 2020
*    Code version: 1.0.3
*    Availability: https://github.com/eivindfjeldstad/dot
*
***************************************************************************************/

/**
* @private
*/
function isIntegerLike(prop) {
  return !isNaN(parseInt('' + prop, 10));
}
/**
 * Get and set points in an object by their 'dot' path
 * @category Bonus Modules
 * @exports dot
 * @public
 */


const dot = {
  name: 'Dot',

  /**
   * Set given `path`
   *
   * @param {Object} obj
   * @param {String} path
   * @param {Mixed} val
   * @return {Object}
   * @public
   */
  set(obj, path, val) {
    const segs = path.split('.');
    const attr = segs.pop();
    const src = obj;
    let currentLayer = obj; // if (segs.includes('c')) debugger;

    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];

      if (isSafe(currentLayer, seg)) {
        if (Array.isArray(currentLayer) && isIntegerLike(seg)) {
          currentLayer[seg] = currentLayer[seg] || [];
          currentLayer = currentLayer[seg];
        } else {
          const overCurrent = currentLayer;
          overCurrent[seg] = overCurrent[seg] || {};
          currentLayer = overCurrent[seg];
        }
      } else {
        return src;
      }
    }

    if (attr !== null && attr !== undefined && isSafe(currentLayer, attr)) {
      if (Array.isArray(currentLayer) && isIntegerLike(attr)) {
        currentLayer[attr] = val;
      } else if (isObject(currentLayer)) {
        currentLayer[attr] = val;
      }
    }

    return src;
  },

  /**
   * Get given `path`
   *
   * @param {Object} obj
   * @param {String} path
   * @return {Mixed}
   * @public
   */
  get(obj, path) {
    const segs = path.split('.');
    const attr = segs.pop();
    let currentLayer = obj;

    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];

      if (isSafe(currentLayer, seg)) {
        if (Array.isArray(currentLayer) && isIntegerLike(seg)) {
          currentLayer = currentLayer[seg];
        } else {
          const overCurrent = currentLayer;
          currentLayer = overCurrent[seg];
        }
      } else {
        return;
      }
    }

    if (attr !== null && attr !== undefined && isSafe(currentLayer, attr)) {
      if (Array.isArray(currentLayer) && isIntegerLike(attr)) {
        return currentLayer[attr];
      } else if (isObject(currentLayer)) {
        return currentLayer[attr];
      } else {
        return;
      }
    } else {
      return;
    }
  },

  /**
   * Delete given `path`
   *
   * @param {Object} obj
   * @param {String} path
   * @return {Mixed}
   * @public
   */
  delete(obj, path) {
    const segs = path.split('.');
    const attr = segs.pop();
    let reObj = obj;

    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      if (!isRecord(reObj) || !reObj[seg]) return;

      if (isSafe(reObj, seg)) {
        reObj = reObj[seg];
      } else {
        return;
      }
    }

    if (attr === null || attr === undefined || !isSafe(reObj, attr)) return;

    if (Array.isArray(reObj)) {
      reObj.splice(parseInt(attr), 1);
    } else {
      delete reObj[attr];
    }
  }

};
/**
* @private
*/

function isSafe(obj, prop) {
  if (isObject(obj)) {
    return obj[prop] === undefined || hasOwnProperty(obj, prop);
  }

  if (Array.isArray(obj)) {
    return !isNaN(parseInt('' + prop, 10));
  }

  return false;
}
/**
* @private
*/


function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
/**
* @private
*/


function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
* @private
*/


function isRecord(obj) {
  return typeof obj === 'object' && obj !== null;
}

/***************************************************************************************
*   MODIFIED FROM
*   Title: eivindfjeldstad/typecast
*   Author: Eivind Fjeldstad
*   Date: August 28, 2020
*   Code version: 1.0.1
*   Availability: https://github.com/eivindfjeldstad/typecast
*
***************************************************************************************/

/**
 * @module typecast
 * @category Bonus Modules
 */

/**
 * Cast given `val` to `type`
 * @name typecast
 * @property {casters} casters
 * @param {Mixed} val
 * @param {String} type
 * @public
 */
const typecast = function (val, type) {
  const fn = typecast.casters[type];
  if (typeof fn !== 'function') throw new Error('cannot cast to ' + type);
  return fn(val);
};

const casters = {
  /**
  * Cast `val` to `String`
  * @alias casters.string
  * @memberof! typecast
  * @param {Mixed} val
  * @returns {string}
  * @public
  */
  string: function (val) {
    if (val === null || val === undefined) return '';

    if (typeof val === 'object' && val !== null && Object.entries(val).length) {
      return JSON.stringify(val);
    }

    return String(val).toString();
  },

  /**
  * Cast `val` to `Number`
  * @alias casters.number
  * @memberof! typecast
  * @param {Mixed} val
  * @returns {number}
  * @public
  */
  number: function (val) {
    const num = parseFloat(String(val).toString());
    return isNaN(num) ? 0 : num;
  },

  /**
  * Cast `val` to a`Date`
  * @alias casters.date
  * @memberof! typecast
  * @param {Mixed} val
  * @returns {Date}
  * @public
  */
  date: function (val) {
    if (!(typeof val === 'string' || typeof val === 'number' || val instanceof Date)) {
      return new Date(0);
    } else {
      const date = new Date(val);
      return isNaN(date.valueOf()) ? new Date(0) : date;
    }
  },

  /**
  * Cast `val` to `Array`
  * @alias casters.array
  * @memberof! typecast
  * @param {Mixed} val
  * @returns {Array}
  * @public
  */
  array: function (val) {
    if (val === null || val === undefined) return [];
    if (val instanceof Array) return val;
    if (typeof val !== 'string') return [val];
    const arr = val.split(',');

    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  /**
  * Cast `val` to `Boolean`
  * @alias casters.boolean
  * @memberof! typecast
  * @param {Mixed} val
  * @returns {boolean}
  * @public
  */
  boolean: function (val) {
    return !!val && val !== 'false' && val !== '0';
  },

  /**
  * Cast `val` to `Object`
  * @alias casters.object
  * @memberof! typecast
  * @param {Mixed} val
  * @returns {object}
  * @public
  */
  object: function (val) {
    if (val === null || val === undefined) return {};
    if (Array.isArray(val)) return Object.fromEntries(Object.entries(val));
    if (typeof val === 'object' && val !== null) return val;
    if (typeof val !== 'string') return {
      value: val
    };
    let obj = {};

    try {
      obj = JSON.parse(val);
    } catch (error) {
      obj = {
        value: val
      };
    }

    return obj;
  }
};
typecast.casters = casters;
Object.defineProperty(typecast, 'name', {
  value: 'Typecast'
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function nonenumerable( // eslint-disable-next-line @typescript-eslint/no-explicit-any
target, propertyKey) {
  const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};

  if (typeof descriptor === 'object') {
    descriptor.enumerable = false;
    Object.defineProperty(target, propertyKey, descriptor);
  }
}
/**
 * Custom errors.
 *
 * @private
 */


class ValidationError extends Error {
  constructor(message, path) {
    super(message);

    this.defineProp = (prop, val) => {
      Object.defineProperty(this, prop, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: val
      });
    };

    nonenumerable(this, 'defineProp');
    this.defineProp('path', path);
    this.defineProp('expose', true);
    this.defineProp('status', 400);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

}

/***************************************************************************************
*   MODIFIED FROM
*   Title: component/component-type
*   Author: Component Org
*   Date: August 28, 2020
*   Code version: 1.2.1
*   Availability: https://github.com/component/type
*
***************************************************************************************/
const toString = Object.prototype.toString;
const funToString = Function.prototype.toString;
const localGlobal = {
  Buffer: typeof Buffer !== 'undefined' ? Buffer : ArrayBuffer,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis: typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : {}
};
/**
 * Return the type of `val` as a string.
 *
 * @param {Mixed} val
 * @return {String}
 * @public
 */

function getType(val) {
  switch (toString.call(val)) {
    case '[object Date]':
      return 'date';

    case '[object RegExp]':
      return 'regexp';

    case '[object Arguments]':
      return 'arguments';

    case '[object Array]':
      return 'array';

    case '[object Error]':
      return 'error';

    case '[object Map]':
      return 'map';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'number' && isNaN(val)) return 'nan';
  if (typeof val === 'object' && isElement(val)) return 'element';
  if (typeof val === 'object' && isNode(val)) return 'node';
  if (typeof val === 'object' && isBuffer(val)) return 'buffer';

  if (isWholeObject(val)) {
    val = val?.valueOf ? val?.valueOf() : Object.prototype.valueOf.apply(val);
  }

  if (typeof val === 'function' && funToString.call(val).substr(0, 5) === 'class') return 'class';
  return typeof val;

  function isWholeObject(obj) {
    return typeof obj === 'object' && obj !== null && !!Object.keys(obj).length;
  }

  function isBuffer(obj) {
    return !!( // Does not support Safari 5-7 (missing Object.prototype.constructor)
    // Accepted as Safari 5-7 (Mobile & Desktop) is at < 0.17% usage
    // https://caniuse.com/usage-table
    obj instanceof localGlobal.Buffer);
  } // HTML Type Checking from https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object
  //Returns true if it is a DOM node


  function isNode(o) {
    const globalKey = 'Node';
    return Object.prototype.hasOwnProperty.call(localGlobal.globalThis, globalKey) ? o instanceof localGlobal.globalThis[globalKey] : o && isWholeObject(o) && typeof o.nodeType === 'number' && typeof o.nodeName === 'string';
  } //Returns true if it is a DOM element


  function isElement(o) {
    const globalKey = 'HTMLElement';
    return Object.prototype.hasOwnProperty.call(localGlobal.globalThis, globalKey) ? o instanceof localGlobal.globalThis[globalKey] : o && isWholeObject(o) && o.nodeType === 1 && typeof o.nodeName === 'string';
  }
}

const typeOf = getType;
/**
 * Assign given key and value (or object) to given object
 *
 * @private
 */

function assign(key, val, obj) {
  if (typeof key === 'string') {
    obj[key] = val;
    return;
  }

  if (typeof key === 'object') {
    Object.keys(key).forEach(k => obj[k] = key[k]);
  }
}
/**
 * Enumerate all permutations of `path`, replacing $ with array indices and * with object indices
 *
 * @private
 */

function enumerate(path, obj, callback) {
  const parts = path.split(/\.[$*](?=\.|$|\*)/);
  const first = parts.shift();
  const arr = dot.get(obj, first || '');

  if (!parts.length) {
    return callback(first || '', arr);
  }

  if (!Array.isArray(arr)) {
    if (typeOf(arr) === 'object') {
      const keys = Object.keys(arr);

      for (let i = 0; i < keys.length; i++) {
        const current = join(keys[i], first);
        const next = current + parts.join('.*');
        enumerate(next, obj, callback);
      }
    }

    return;
  }

  for (let i = 0; i < arr.length; i++) {
    const current = join(i, first);
    const next = current + parts.join('.$');
    enumerate(next, obj, callback);
  }
}
/**
 * Walk object and call `callback` with path and prop name
 *
 * @private
 */

function walk(obj, callback, path, prop) {
  const type = typeOf(obj);

  if (type === 'array') {
    const localObj = obj;
    localObj.forEach((v, i) => walk(v, callback, join(i, path), join('$', prop)));
    return;
  }

  if (type !== 'object') {
    return;
  }

  const localObj = obj;

  for (const [key, val] of Object.entries(localObj)) {
    const newPath = join(key, path);
    const newProp = join(key, prop);
    const newCatchProp = join('*', prop);

    if (callback(newPath, newCatchProp, true)) {
      walk(val, callback, newPath, newCatchProp);
    } else if (callback(newPath, newProp)) {
      walk(val, callback, newPath, newProp);
    }
  }
}
/**
 * Join `path` with `prefix`
 *
 * @private
 */

function join(path, prefix) {
  return prefix ? `${prefix.toString()}.${path.toString()}` : path.toString();
}
function isWholeObject(obj) {
  return typeof obj === 'object' && obj !== null && !!Object.keys(obj).length;
}
function isLimitedKey(prop) {
  return typeof prop === 'string' || typeof prop === 'number' || typeof prop === 'symbol';
}
function isRule(obj) {
  return typeof obj === 'function' || typeof obj === 'object' || typeof obj === 'string' || Array.isArray(obj) || typeof obj === 'boolean';
}
function hasConstructor(obj) {
  return typeof obj['constructor'] === 'function';
}
function isSomething(obj) {
  return typeof obj === 'object' || typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean';
}

/**
 * A property instance gets returned whenever you call `schema.path()`.
 * Properties are also created internally when an object is passed to the Schema constructor.
 *
 * @param {String} name - the name of the property
 * @param {Schema} schema - parent schema
 */

class Property {
  constructor(name, schema) {
    this.name = name;
    this.registry = {};
    this._schema = schema;
    this._type = null;
    this.messages = {};
  }
  /**
  * Registers messages.
  *
  * @example
  * prop.message('something is wrong')
  * prop.message({ required: 'thing is required.' })
  *
  * @param {Object|String} messages
  * @return {Property}
  */


  message(messages) {
    if (typeof messages === 'string') {
      messages = {
        default: messages
      };
    }

    const entries = Object.entries(messages);

    for (const [key, val] of entries) {
      this.messages[key] = val;
    }

    return this;
  }
  /**
  * Mount given `schema` on current path.
  *
  * @example
  * const user = new Schema({ email: String })
  * prop.schema(user)
  *
  * @param {Schema} schema - the schema to mount
  * @return {Property}
  */


  schema(schema) {
    this._schema.path(this.name, schema);

    return this;
  }
  /**
  * Validate using named functions from the given object.
  * Error messages can be defined by providing an object with
  * named error messages/generators to `schema.message()`
  *
  * The message generator receives the value being validated,
  * the object it belongs to and any additional arguments.
  *
  * @example
  * const schema = new Schema()
  * const prop = schema.path('some.path')
  *
  * schema.message({
  *   binary: (path, ctx) => `${path} must be binary.`,
  *   bits: (path, ctx, bits) => `${path} must be ${bits}-bit`
  * })
  *
  * prop.use({
  *   binary: (val, ctx) => /^[01]+$/i.test(val),
  *   bits: [(val, ctx, bits) => val.length == bits, 32]
  * })
  *
  * @param {Object} fns - object with named validation functions to call
  * @return {Property}
  */


  use(fns) {
    Object.keys(fns).forEach(name => {
      let arr = fns[name];
      if (!Array.isArray(arr)) arr = [arr];
      const fn = arr.shift();

      this._register(name, arr, fn);
    });
    return this;
  }
  /**
  * Registers a validator that checks for presence.
  *
  * @example
  * prop.required()
  *
  * @param {Boolean} [bool] - `true` if required, `false` otherwise
  * @return {Property}
  */


  required(bool = true) {
    return this._register('required', [bool]);
  }
  /**
  * Registers a validator that checks if a value is of a given `type`
  *
  * @example
  * prop.type(String)
  *
  * @example
  * prop.type('string')
  *
  * @param {String|Function} type - type to check for
  * @return {Property}
  */


  type(type) {
    this._type = type;
    return this._register('type', [type]);
  }
  /**
  * Convenience method for setting type to `String`
  *
  * @example
  * prop.string()
  *
  * @return {Property}
  */


  string() {
    return this.type(String);
  }
  /**
  * Convenience method for setting type to `Number`
  *
  * @example
  * prop.number()
  *
  * @return {Property}
  */


  number() {
    return this.type(Number);
  }
  /**
  * Convenience method for setting type to `Array`
  *
  * @example
  * prop.array()
  *
  * @return {Property}
  */


  array() {
    return this.type(Array);
  }
  /**
  * Convenience method for setting type to `Object`
  *
  * @example
  * prop.object()
  *
  * @return {Property}
  */


  object() {
    return this.type(Object);
  }
  /**
  * Convenience method for setting type to `Date`
  *
  * @example
  * prop.date()
  *
  * @return {Property}
  */


  date() {
    return this.type(Date);
  }
  /**
  * Registers a validator that checks length.
  *
  * @example
  * prop.length({ min: 8, max: 255 })
  * prop.length(10)
  *
  * @param {Object|Number} rules - object with `.min` and `.max` properties or a number
  * @param {Number} rules.min - minimum length
  * @param {Number} rules.max - maximum length
  * @return {Property}
  */


  length(rules) {
    return this._register('length', [rules]);
  }
  /**
  * Registers a validator that checks size.
  *
  * @example
  * prop.size({ min: 8, max: 255 })
  * prop.size(10)
  *
  * @param {Object|Number} rules - object with `.min` and `.max` properties or a number
  * @param {Number} rules.min - minimum size
  * @param {Number} rules.max - maximum size
  * @return {Property}
  */


  size(rules) {
    return this._register('size', [rules]);
  }
  /**
  * Registers a validator for enums.
  *
  * @example
  * prop.enum(['cat', 'dog'])
  *
  * @param {Array} rules - allowed values
  * @return {Property}
  */


  enum(enums) {
    return this._register('enum', [enums]);
  }
  /**
  * Registers a validator that checks if a value matches given `regexp`.
  *
  * @example
  * prop.match(/some\sregular\sexpression/)
  *
  * @param {RegExp} regexp - regular expression to match
  * @return {Property}
  */


  match(regexp) {
    return this._register('match', [regexp]);
  }
  /**
  * Registers a validator that checks each value in an array against given `rules`.
  *
  * @example
  * prop.each({ type: String })
  * prop.each([{ type: Number }])
  * prop.each({ things: [{ type: String }]})
  * prop.each(schema)
  *
  * @param {Array|Object|Schema|Property} rules - rules to use
  * @return {Property}
  */


  each(rules) {
    this._schema.path(join('$', this.name), rules);

    return this;
  }
  /**
  * Registers paths for array elements on the parent schema, with given array of rules.
  *
  * @example
  * prop.elements([{ type: String }, { type: Number }])
  *
  * @param {Array} arr - array of rules to use
  * @return {Property}
  */


  elements(arr) {
    arr.forEach((rules, i) => {
      this._schema.path(join(i, this.name), rules);
    });
    return this;
  }
  /**
  * Registers all properties from the given object as nested properties
  *
  * @example
  * prop.properties({
  *   name: String,
  *   email: String
  * })
  *
  * @param {Object} props - properties with rules
  * @return {Property}
  */


  properties(props) {
    for (const [prop, rule] of Object.entries(props)) {
      this._schema.path(join(prop, this.name), rule);
    }

    return this;
  }
  /**
  * Proxy method for schema path. Makes chaining properties together easier.
  *
  * @example
  * schema
  *   .path('name').type(String).required()
  *   .path('email').type(String).required()
  *
  */


  path(path, rules) {
    return this._schema.path(path, rules);
  }
  /**
  * Typecast given `value`
  *
  * @example
  * prop.type(String)
  * prop.typecast(123) // => '123'
  *
  * @param {Mixed} value - value to typecast
  * @return {Mixed}
  */


  typecast(value) {
    const schema = this._schema;
    let type = this._type;
    if (!type) return value;

    if (typeof type === 'function') {
      type = type.name;
    }

    const cast = schema.typecasters[type] || typeof type === 'string' && schema.typecasters[type.toLowerCase()];

    if (typeof cast !== 'function') {
      throw new Error(`Typecasting failed: No typecaster defined for ${type.toString()}.`);
    }

    return cast(value);
  }
  /**
  * Validate given `value`
  *
  * @example
  * prop.type(Number)
  * assert(prop.validate(2) == null)
  * assert(prop.validate('hello world') instanceof Error)
  *
  * @param {Mixed} value - value to validate
  * @param {Object} ctx - the object containing the value
  * @param {String} [path] - path of the value being validated
  * @return {ValidationError}
  */


  validate(value, ctx, path = this.name) {
    const types = Object.keys(this.registry);

    for (const type of types) {
      const err = this._run(type, value, ctx, path);

      if (err) return err;
    }

    return null;
  }
  /**
  * Run validator of given `type`
  *
  * @param {String} type - type of validator
  * @param {Mixed} value - value to validate
  * @param {Object} ctx - the object containing the value
  * @param {String} path - path of the value being validated
  * @return {ValidationError}
  * @private
  */


  _run(type, value, ctx, path) {
    if (!this.registry[type]) return;
    const isValidator = this._isValidator;
    const schema = this._schema;
    const {
      args,
      fn
    } = this.registry[type];
    let validator = false;
    let valid = false;

    if (fn) {
      validator = fn;
    } else if (isValidator.call(this, type)) {
      validator = schema.validators[type];
    }

    if (validator) {
      valid = validator(value, ctx, ...args, path);
    }

    if (!valid) return this._error(type, ctx, args, path);
  }
  /**
  * Register validator
  *
  * @param {String} type - type of validator
  * @param {Array} args - argument to pass to validator
  * @param {Function} [fn] - custom validation function to call
  * @return {Property}
  * @private
  */


  _register(type, args, fn) {
    this.registry[type] = {
      args,
      fn
    };
    return this;
  }
  /**
  * Create an error
  *
  * @param {String} type - type of validator
  * @param {Object} ctx - the object containing the value
  * @param {Array} args - arguments to pass
  * @param {String} path - path of the value being validated
  * @return {ValidationError}
  * @private
  */


  _error(type, ctx, args, path) {
    const schema = this._schema;
    const isMessage = this._isMessage;
    let message = this.messages[type] || this.messages.default;

    if (!message) {
      if (isMessage.call(this, type)) {
        message = schema.messages[type];
      } else {
        message = schema.messages.default;
      }
    }

    if (typeof message === 'function') {
      message = message(path, ctx, ...args);
    }

    return new ValidationError(message.toString(), path);
  }

  _isValidator(fnName) {
    const schema = this._schema;
    const isProp = Object.prototype.hasOwnProperty.call(schema.validators, fnName);
    return isProp && typeof schema.validators[fnName] === 'function';
  }

  _isMessage(fnName) {
    const schema = this._schema;
    const isProp = Object.prototype.hasOwnProperty.call(schema.messages, fnName);
    return isProp && typeof schema.messages[fnName] === 'function' || typeof schema.messages[fnName] === 'string';
  }

}

const Messages = {
  // Type message
  type(prop, ctx, type) {
    if (typeof type === 'function') {
      type = type.name;
    }

    return `${prop} must be of type ${type}.`;
  },

  // Required message
  required(prop) {
    return `${prop} is required.`;
  },

  // Match message
  match(prop, ctx, regexp) {
    return `${prop} must match ${regexp}.`;
  },

  // Length message
  length(prop, ctx, len) {
    if (typeof len === 'number') {
      return `${prop} must have a length of ${len}.`;
    }

    const {
      min,
      max
    } = len;

    if (min && max) {
      return `${prop} must have a length between ${min} and ${max}.`;
    }

    if (max) {
      return `${prop} must have a maximum length of ${max}.`;
    }

    if (min) {
      return `${prop} must have a minimum length of ${min}.`;
    }

    return `${prop} must have a valid length`;
  },

  // Size message
  size(prop, ctx, size) {
    if (typeof size === 'number') {
      return `${prop} must have a size of ${size}.`;
    }

    const {
      min,
      max
    } = size;

    if (min !== undefined && max !== undefined) {
      return `${prop} must be between ${min} and ${max}.`;
    }

    if (max !== undefined) {
      return `${prop} must be less than ${max}.`;
    }

    if (min !== undefined) {
      return `${prop} must be greater than ${min}.`;
    }

    return `${prop} must have a valid size`;
  },

  // Enum message
  enum(prop, ctx, enums) {
    const copy = enums.slice();
    const last = copy.pop();
    return `${prop} must be either ${copy.join(', ')} or ${last?.toString()}.`;
  },

  // Illegal property
  illegal(prop) {
    return `${prop} is not allowed.`;
  },

  // Default message
  default(prop) {
    return `Validation failed for ${prop}.`;
  }

};

/**
 * Default validators.
 *
 * @private
 */

const Validators = {
  /**
  * Validates presence.
  *
  * @param {Mixed} value - the value being validated
  * @param {Object} ctx - the object being validated
  * @param {Bolean} required
  * @return {Boolean}
  */
  required(value, ctx, required) {
    if (required === false) return true;
    return value !== null && value !== undefined && value !== '';
  },

  /**
  * Validates type.
  *
  * @param {Mixed} value - the value being validated
  * @param {Object} ctx - the object being validated
  * @param {String|Function} name name of the type or a constructor
  * @return {Boolean}
  */
  type(value, ctx, name) {
    if (value === null || value === undefined) return true;

    if (typeof name === 'function' && value !== null && isSomething(value) && hasConstructor(value)) {
      return value['constructor'] === name;
    }

    return getType(value) === name;
  },

  /**
  * Validates length.
  *
  * @param {String} value the string being validated
  * @param {Object} ctx the object being validated
  * @param {Object|Number} rules object with .min and/or .max props or a number
  * @param {Number} [rules.min] - minimum length
  * @param {Number} [rules.max] - maximum length
  * @return {Boolean}
  */
  length(value, ctx, len) {
    if (value === null || value === undefined) return true;

    if (typeof len === 'number') {
      return value.length === len;
    }

    if (typeof len.min === 'string') len.min = parseInt(len.min);
    if (typeof len.max === 'string') len.max = parseInt(len.max);
    const {
      min,
      max
    } = len;
    if (min && value.length < min) return false;
    if (max && value.length > max) return false;
    return true;
  },

  /**
  * Validates size.
  *
  * @param {Number} value the number being validated
  * @param {Object} ctx the object being validated
  * @param {Object|Number} size object with .min and/or .max props or a number
  * @param {String|Number} [size.min] - minimum size
  * @param {String|Number} [size.max] - maximum size
  * @return {Boolean}
  */
  size(value, ctx, size) {
    if (value === null || value === undefined) return true;

    if (typeof size === 'number') {
      return value === size;
    }

    if (typeof size.min === 'string') size.min = parseInt(size.min);
    if (typeof size.max === 'string') size.max = parseInt(size.max);
    const {
      min,
      max
    } = size;
    if (min !== undefined && min !== null && value < min) return false;
    if (max !== undefined && max !== null && value > max) return false;
    return true;
  },

  /**
  * Validates enums.
  *
  * @param {String} value the string being validated
  * @param {Object} ctx the object being validated
  * @param {Array} enums array with allowed values
  * @return {Boolean}
  */
  enum(value, ctx, enums) {
    if (value === null || value === undefined) return true;
    return enums.includes(value);
  },

  /**
  * Validates against given `regexp`.
  *
  * @param {String} value the string beign validated
  * @param {Object} ctx the object being validated
  * @param {RegExp} regexp the regexp to validate against
  * @return {Boolean}
  */
  match(value, ctx, regexp) {
    if (value === null || value === undefined) return true;
    return regexp.test(value);
  }

};

/**
 * @module Schema
 */

/**
 * A Schema defines the structure that objects should be validated against.
 * @example
 * const post = new Schema({
 *   title: {
 *     type: String,
 *     required: true,
 *     length: { min: 1, max: 255 }
 *   },
 *   content: {
 *     type: String,
 *     required: true
 *   },
 *   published: {
 *     type: Date,
 *     required: true
 *   },
 *   keywords: [{ type: String }]
 * })
 *
 * @param {Object} [obj] - schema definition
 * @param {Object} [opts] - options
 * @param {Boolean} [opts.typecast=false] - typecast values before validation
 * @param {Boolean} [opts.strip=true] - strip properties not defined in the schema
 * @param {Boolean} [opts.strict=false] - validation fails when object contains properties not defined in the schema
 */

class Schema {
  constructor(obj = {}, opts = {}) {
    this.opts = opts;
    this.hooks = [];
    this.props = {};
    this.messages = Object.assign({}, Messages);
    this.validators = Object.assign({}, Validators);
    this.typecasters = Object.assign({}, typecast.casters);
    Object.keys(obj).forEach(k => this.path(k, obj[k]));
  }
  /**
  * Create or update `path` with given `rules`.
  *
  * @example
  * const schema = new Schema()
  * schema.path('name.first', { type: String })
  * schema.path('name.last').type(String).required()
  *
  * @param {String} path - full path using dot-notation
  * @param {Object|Array|String|Schema|Property} [rules] - rules to apply
  * @return {Property}
  */


  path(path, rules) {
    const parts = path.split('.');
    const suffix = parts.pop();
    const prefix = parts.join('.'); // Make sure full path is created

    if (prefix) {
      this.path(prefix);
    } // Array index placeholder


    if (suffix === '$') {
      this.path(prefix).type(Array);
    } // Catchall Object placeholder


    if (suffix === '*') {
      this.path(prefix).type(Object);
    } // Nested schema


    if (rules instanceof Schema) {
      rules.hook((k, v) => this.path(join(k, path), v));
      return this.path(path, rules.props);
    } // Return early when given a `Property`


    if (rules instanceof Property) {
      this.props[path] = rules; // Notify parents if mounted

      this.propagate(path, rules);
      return rules;
    }

    const prop = this.props[path] || new Property(path, this);
    this.props[path] = prop; // Notify parents if mounted

    this.propagate(path, prop); // No rules?

    if (!rules) return prop; // type shorthand
    // `{ name: String }`

    if (typeof rules === 'string' || typeof rules === 'function') {
      prop.type(rules);
      return prop;
    } // Allow arrays to be defined implicitly:
    // `{ keywords: [String] }`
    // `{ keyVal: [[String, Number]] }`


    if (Array.isArray(rules)) {
      prop.type(Array);

      if (rules.length === 1) {
        if (isRule(rules[0])) {
          prop.each(rules[0]);
        }
      } else {
        if (rules.every(x => isRule(x))) {
          prop.elements(rules);
        }
      }

      return prop;
    }

    const keys = Object.keys(rules);
    let nested = false; // Check for nested objects

    for (const key of keys) {
      if (isWholeObject(prop) && typeof prop[key] === 'function') continue;
      prop.type(Object);
      nested = true;
      break;
    }

    keys.forEach(key => {
      const rule = rules[key];

      if (isRule(rule)) {
        if (nested) {
          return this.path(join(key, path), rule);
        }

        if (isWholeObject(prop)) {
          const pathFn = prop[key];

          if (typeof pathFn === 'function') {
            pathFn.call(prop, rule);
          }
        }
      }
    });
    return prop;
  }
  /**
  * Typecast given `obj`.
  *
  * @param {Object} obj - the object to typecast
  * @return {Schema}
  * @private
  */


  typecast(obj) {
    for (const [path, prop] of Object.entries(this.props)) {
      if (isWholeObject(obj)) {
        enumerate(path, obj, (key, value) => {
          if (value === null || value === undefined) return;
          const cast = prop.typecast(value);
          if (cast === value) return;
          dot.set(obj, key, cast);
        });
      }
    }

    return this;
  }
  /**
  * Strip all keys not defined in the schema
  *
  * @param {Object} obj - the object to strip
  * @param {String} [prefix]
  * @return {Schema}
  * @private
  */


  strip(obj) {
    walk(obj, (path, prop, isCatchall = false) => {
      if (isLimitedKey(prop) && this.props[prop]) return true;
      if (isCatchall) return false;
      if (isWholeObject(obj)) dot.delete(obj, path);
      return false;
    });
    return this;
  }
  /**
  * Create errors for all properties that are not defined in the schema
  *
  * @param {Object} obj - the object to check
  * @return {Schema}
  * @private
  */


  enforce(obj) {
    const errors = [];
    walk(obj, (path, prop, isCatchall = false) => {
      if (isLimitedKey(prop) && this.props[prop]) return true;
      if (isCatchall) return false;
      const error = new ValidationError(Messages.illegal(path), path);
      errors.push(error);
      return false;
    });
    return errors;
  }
  /**
  * Validate given `obj`.
  *
  * @example
  * const schema = new Schema({ name: { required: true }})
  * const errors = schema.validate({})
  * assert(errors.length == 1)
  * assert(errors[0].message == 'name is required')
  * assert(errors[0].path == 'name')
  *
  * @param {Object} obj - the object to validate
  * @param {Object} [opts] - options, see [Schema](#schema-1)
  * @return {Array}
  */


  validate(obj, opts = {}) {
    opts = Object.assign(this.opts, opts);
    const errors = [];

    if (opts.typecast) {
      this.typecast(obj);
    }

    if (opts.strict) {
      errors.push(...this.enforce(obj));
    }

    if (opts.strip !== false) {
      this.strip(obj);
    }

    for (const [path, prop] of Object.entries(this.props)) {
      enumerate(path, obj, (key, value) => {
        const err = prop.validate(value, obj, key);
        if (err) errors.push(err);
      });
    }

    return errors;
  }
  /**
  * Assert that given `obj` is valid.
  *
  * @example
  * const schema = new Schema({ name: String })
  * schema.assert({ name: 1 }) // Throws an error
  *
  * @param {Object} obj
  * @param {Object} [opts]
  */


  assert(obj, opts) {
    const [err] = this.validate(obj, opts);
    if (err) throw err;
  }
  /**
  * Override default error messages.
  *
  * @example
  * const hex = (val) => /^0x[0-9a-f]+$/.test(val)
  * schema.path('some.path').use({ hex })
  * schema.message('hex', path => `${path} must be hexadecimal`)
  *
  * @example
  * schema.message({ hex: path => `${path} must be hexadecimal` })
  *
  * @param {String|Object} name - name of the validator or an object with name-message pairs
  * @param {String|Function} [message] - the message or message generator to use
  * @return {Schema}
  */


  message(name, message) {
    assign(name, message, this.messages);
    return this;
  }
  /**
  * Override default validators.
  *
  * @example
  * schema.validator('required', val => val != null)
  *
  * @example
  * schema.validator({ required: val => val != null })
  *
  * @param {String|Object} name - name of the validator or an object with name-function pairs
  * @param {Function} [fn] - the function to use
  * @return {Schema}
  */


  validator(name, fn) {
    assign(name, fn, this.validators);
    return this;
  }
  /**
  * Override default typecasters.
  *
  * @example
  * schema.typecaster('SomeClass', val => new SomeClass(val))
  *
  * @example
  * schema.typecaster({ SomeClass: val => new SomeClass(val) })
  *
  * @param {String|Object} name - name of the validator or an object with name-function pairs
  * @param {Function} [fn] - the function to use
  * @return {Schema}
  */


  typecaster(name, fn) {
    assign(name, fn, this.typecasters);
    return this;
  }
  /**
  * Accepts a function that is called whenever new props are added.
  *
  * @param {Function} fn - the function to call
  * @return {Schema}
  * @private
  */


  hook(fn) {
    this.hooks.push(fn);
    return this;
  }
  /**
  * Notify all subscribers that a property has been added.
  *
  * @param {String} path - the path of the property
  * @param {Property} prop - the new property
  * @return {Schema}
  * @private
  */


  propagate(path, prop) {
    this.hooks.forEach(fn => fn(path, prop));
    return this;
  }

}
Schema.ValidationError = ValidationError;

exports.Schema = Schema;
