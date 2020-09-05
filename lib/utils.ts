import dot from './dot';
import { getType } from './type';
const typeOf = getType;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { key, rec, obj, rule, something } from './tsPrimitives';
type keyProp = key | rec;

/**
 * Assign given key and value (or object) to given object
 *
 * @private
 */
export function assign(key: keyProp, val: unknown, obj: rec): void {
	if (typeof key === 'string') {
		obj[key] = val;
		return;
	}
	if (typeof key === 'object') {
		Object.keys(key).forEach((k) => obj[k] = key[k]);
	}
}

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

/**
 * Join `path` with `prefix`
 *
 * @private
 */
export function join(path: keyProp, prefix?: keyProp): string {
	return prefix
		? `${prefix.toString()}.${path.toString()}`
		: path.toString();
}

export function isWholeObject(obj: unknown): obj is obj {
	return typeof obj === 'object' && obj !== null && !!Object.keys(obj).length; 
}

export function isKeyAble(prop: unknown): prop is key {
	return typeof prop === 'string' || typeof prop === 'number' || typeof prop === 'symbol';
}
export function isLimitedKey(prop: unknown): prop is string | number {
	return typeof prop === 'string' || typeof prop === 'number' || typeof prop === 'symbol';
}

export function isIntegerLike(prop: unknown): prop is number {
	return !isNaN(parseInt('' + prop, 10));
}
export function isNumberLike(prop: unknown): prop is number {
	return typeof prop === 'number' || !isNaN(parseFloat('' + prop));
}

export function isRule(obj: unknown): obj is rule {
	return typeof obj === 'function' || typeof obj === 'object' || typeof obj === 'string' || Array.isArray(obj) || typeof obj === 'boolean'; 
}
export type objOrFn = rec | CallableFunction | string;
export function isObjOrFn(obj: unknown): obj is objOrFn {
	return typeof obj === 'function' || (typeof obj === 'object' && !Array.isArray(obj) ) || typeof obj === 'string';
}
export function hasOwnProperty(obj: rec, prop: PropertyKey): prop is keyof rec {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}
type hasConstruct = unknown & {constructor: CallableFunction}
export function hasConstructor(obj: NonNullable<something>): obj is hasConstruct {
	return typeof obj['constructor'] === 'function';
}

export function isSomething(obj: NonNullable<unknown>): obj is NonNullable<something> {
	return typeof obj === 'object' || typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean';
}
