'use strict';

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
 * Cast given `val` to `type`
 *
 * @param {Mixed} val
 * @param {String} type
 * @api public
 */
const typecast = function (val, type) {
  const fn = typecast.casters[type];
  if (typeof fn !== 'function') throw new Error('cannot cast to ' + type);
  return fn(val);
};

const casters = {
  /**
   * Cast `val` to `String`
   *
   * @param {Mixed} val
   * @api public
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
  *
  * @param {Mixed} val
  * @api public
  */
  number: function (val) {
    const num = parseFloat(String(val).toString());
    return isNaN(num) ? 0 : num;
  },

  /**
  * Cast `val` to a`Date`
  *
  * @param {Mixed} val
  * @api public
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
  *
  * @param {Mixed} val
  * @api public
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
  *
  * @param {Mixed} val
  * @api public
  */
  boolean: function (val) {
    return !!val && val !== 'false' && val !== '0';
  },

  /**
  * Cast `val` to `Object`
  *
  * @param {Mixed} val
  * @api public
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

module.exports = typecast;
