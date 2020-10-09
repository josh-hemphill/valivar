import { key, rec, obj, rule, something, fromString, keyProp } from './tsPrimitives';

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
	return typeof prop === 'string' || typeof prop === 'number';
}

export function isIntegerLike(prop: unknown): prop is number {
	return typeof prop !== 'symbol' && !isNaN(parseInt('' + prop, 10));
}
export function isNumberLike(prop: unknown): prop is number {
	return typeof prop === 'number' || (typeof prop !== 'symbol' && !isNaN(parseFloat('' + prop)));
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

/**
* @private
*/
export function isSafe(obj: unknown, prop: NonNullable<fromString>): obj is rec | unknown[] {
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
export function isObject(obj: unknown): obj is rec {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
* @private
*/
export function isRecord(obj:unknown): obj is Record<string | number, unknown> {
	return typeof obj === 'object' && obj !== null;
}
