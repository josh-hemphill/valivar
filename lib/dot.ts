/***************************************************************************************
*    Title: eivindfjeldstad/dot
*    Author: Eivind Fjeldstad
*    Date: August 28, 2020
*    Code version: 1.0.3
*    Availability: https://github.com/eivindfjeldstad/dot
*
***************************************************************************************/

import { rec, obj, fromString, arr, keyProp } from './tsPrimitives';
import getType from './type';
import { isIntegerLike, isObject, isSafe, isRecord, join } from './utils';

/**
 * Get and set points in an object by their 'dot' path
 */
export const dot = {
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
	set(obj: obj | arr, path: string, val: unknown): obj | arr {
		const segs = path.split('.');
		const attr = segs.pop();
		const src = obj;
		let currentLayer: unknown = obj;
	
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
	get(obj: obj | arr, path: string): unknown {
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
		if (attr !== null && attr !== undefined) {
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
	delete(obj: obj | arr, path: string): void {
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

const typeOf = getType;

type enumerateCallback = (first: string, arr: unknown, flag?: boolean) => unknown;
/**
 * Enumerate all permutations of `path`, replacing $ with array indices and * with object indices
 *
 * @private
 */
export function enumerate(path: string, obj: rec, callback: enumerateCallback): void | ReturnType<enumerateCallback> {
	const parts = path.split(/\.[$*](?=\.|$|\*)/);
	const first = parts.shift();
	const arr = dot.get(obj, first || '');

	if (!parts.length) {
		return callback(first || '', arr);
	}

	if (!Array.isArray(arr)) {
		if (typeOf(arr) === 'object') {
			const keys = Object.keys(<obj> arr);
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
export function walk(obj: unknown, callback: enumerateCallback, path?: string, prop?: keyProp): void | ReturnType<enumerateCallback> {
	const type = typeOf(obj);

	if (type === 'array') {
		const localObj = <unknown[]> obj;
		localObj.forEach((v, i) =>
			walk(v, callback, join(i, path), join('$', prop)),
		);
		return;
	}

	if (type !== 'object') {
		return;
	}
	const localObj = <obj> obj;
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
