/***************************************************************************************
*   MODIFIED FROM
*   Title: eivindfjeldstad/typecast
*   Author: Eivind Fjeldstad
*   Date: August 28, 2020
*   Code version: 1.0.1
*   Availability: https://github.com/eivindfjeldstad/typecast
*
***************************************************************************************/

import { typecasters, typecastFunction, empty, rec } from './tsPrimitives';


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
const typecast = function(val: unknown, type: keyof typecasters): ReturnType<typecastFunction> {
	const fn = typecast.casters[type];
	if (typeof fn !== 'function') throw new Error('cannot cast to ' + type);
	return fn(val);
};

const casters: typecasters = {
	/**
	* Cast `val` to `String`
	* @alias casters.string
	* @memberof! typecast
	* @param {Mixed} val
	* @returns {string}
	* @public
	*/
	string: function(val: unknown): string {
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
	number: function(val: unknown): number {
		const num = parseFloat(String(val).toString());
		return isNaN(num)
			? 0
			: num;
	},

	/**
	* Cast `val` to a`Date`
	* @alias casters.date
	* @memberof! typecast
	* @param {Mixed} val
	* @returns {Date}
	* @public
	*/
	date: function(val: unknown) {
		if (!(typeof val === 'string' || typeof val === 'number' || val instanceof Date)) {
			return new Date(0);
		} else {
			const date = new Date(val);
			return isNaN(date.valueOf())
				? new Date(0)
				: date;
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
	array: function(val: unknown) {
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
	boolean: function(val: unknown) {
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
	object: function(val: unknown): NonNullable<rec> | typeof empty {
		if (val === null || val === undefined) return {};
		if (Array.isArray(val)) return Object.fromEntries(Object.entries(val));
		if (typeof val === 'object' && val !== null) return val;
		if (typeof val !== 'string') return { value: val };
		let obj = {};
		try {
			obj = JSON.parse(val);
		} catch (error) {
			obj = { value: val };
		}
		return obj;
	},
	/**
	* Any custom typecast function.
	* Cast `val` to the type of the functions namesake
	* @alias casters.[any]
	* @memberof! typecast
	* @param {Mixed} val
	* @returns {Mixed}
	* @public
	*/
};

typecast.casters = casters;
Object.defineProperty(typecast, 'name', {
	value: 'Typecast',
});

export {typecast};
