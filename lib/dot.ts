/***************************************************************************************
*    Title: eivindfjeldstad/dot
*    Author: Eivind Fjeldstad
*    Date: August 28, 2020
*    Code version: 1.0.3
*    Availability: https://github.com/eivindfjeldstad/dot
*
***************************************************************************************/

import { rec, obj, fromString, key } from './tsPrimitives';

/**
* @private
*/
function isIntegerLike(prop: unknown): prop is number {
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
	set(obj: obj, path: string, val: unknown): obj {
		const segs = path.split('.');
		const attr = segs.pop();
		const src = obj;
		let currentLayer: unknown = obj;
		// if (segs.includes('c')) debugger;
	
		for (let i = 0; i < segs.length; i++) {
			const seg = segs[i];
			if (isSafe(currentLayer, seg)) {
				if (Array.isArray(currentLayer) && isIntegerLike(seg)) {
					currentLayer[seg] = currentLayer[seg] || [] ;
					currentLayer = currentLayer[seg];
				} else {
					const overCurrent = <rec>currentLayer;
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
	get(obj: obj, path: string): unknown {
		const segs = <fromString[]> path.split('.');
		const attr = segs.pop();
		let currentLayer: unknown = obj;

		for (let i = 0; i < segs.length; i++) {
			const seg = segs[i];
			if (isSafe(currentLayer, seg)){
				if (Array.isArray(currentLayer) && isIntegerLike(seg)) {
					currentLayer = currentLayer[seg];
				} else {
					const overCurrent = <rec>currentLayer;
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
	delete(obj: obj, path: string): void {
		const segs = path.split('.');
		const attr = segs.pop();
		let reObj: unknown = obj;
	
		for (let i = 0; i < segs.length; i++) {
			const seg = segs[i];
			if (!isRecord(reObj) || !reObj[seg]) return;
			if (isSafe(reObj, seg)){
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
	},
};
export default dot;

/**
* @private
*/
function isSafe(obj: unknown, prop: NonNullable<fromString>): obj is rec | unknown[] {
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
function hasOwnProperty(obj: rec, prop: PropertyKey): prop is keyof rec {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
* @private
*/
function isObject(obj: unknown): obj is rec {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
* @private
*/
function isRecord(obj:unknown): obj is Record<string | number, unknown> {
	return typeof obj === 'object' && obj !== null;
}
