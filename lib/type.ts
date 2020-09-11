/***************************************************************************************
*   MODIFIED FROM
*   Title: component/component-type
*   Author: Component Org
*   Date: August 28, 2020
*   Code version: 1.2.1
*   Availability: https://github.com/component/type
*
***************************************************************************************/

import { obj } from './tsPrimitives';

const toString = Object.prototype.toString;
const funToString = Function.prototype.toString;
export default getType;


/**
 * Return the type of `val` as a string.
 *
 * @param {Mixed} val
 * @return {String}
 * @public
 */
export function getType(this: obj, val: unknown): string {
	switch (toString.call(val)) {
	case '[object Date]': return 'date';
	case '[object RegExp]': return 'regexp';
	case '[object Arguments]': return 'arguments';
	case '[object Array]': return 'array';
	case '[object Error]': return 'error';
	case '[object Map]': return 'map';
	} 

	if (val === null) return 'null';
	if (val === undefined) return 'undefined';

	if (!this?.Buffer) this.Buffer = ArrayBuffer;
	if (!this.globalThis) this.globalThis = {};

	if (typeof val === 'number' && isNaN(val)) return 'nan';
	if (typeof val === 'object' && isElement(val)) return 'element';
	if (typeof val === 'object' && isNode(val)) return 'node';
	if (typeof val === 'object' && isBuffer(val)) return 'buffer';
	if (isWholeObject(val)) {
		val = val?.valueOf
			? val?.valueOf()
			: Object.prototype.valueOf.apply(val);
	}

	if (typeof val === 'function' && funToString.call(val).substr(0,5) === 'class') return 'class';

	return typeof val;

	function isWholeObject(obj: unknown): obj is obj {
		return typeof obj === 'object' && obj !== null && !!Object.keys(obj).length; 
	}

	function isBuffer(obj: unknown): boolean {
		return !!(
		// Does not support Safari 5-7 (missing Object.prototype.constructor)
		// Accepted as Safari 5-7 (Mobile & Desktop) is at < 0.17% usage
		// https://caniuse.com/usage-table
			obj instanceof Buffer
		);
	}

	// HTML Type Checking from https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object
	//Returns true if it is a DOM node
	function isNode(o: unknown): boolean {
		const globalKey = 'Node';
		return (
			isGlobal(globalKey) ? o instanceof globalThis[globalKey] : 
				o && isWholeObject(o) && typeof o.nodeType === 'number' && typeof o.nodeName==='string'
		);
	}
	//Returns true if it is a DOM element
	function isElement(o: unknown): boolean {
		const globalKey = 'HTMLElement';
		return (
			isGlobal(globalKey) ? o instanceof globalThis[globalKey] : 
				o && isWholeObject(o) && o.nodeType === 1 && typeof o.nodeName==='string'
		);
	}

	function isGlobal(name:string): name is keyof typeof globalThis {
		return Object.prototype.hasOwnProperty.call(globalThis, name);
	}

}
