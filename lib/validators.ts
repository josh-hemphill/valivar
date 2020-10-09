import typeOf from './type';
import { 
	rec, 
	empty, 
	magnitudeOptions,
	typeOf_Key,
	ValidationFunction,
} from './tsPrimitives';

// eslint-disable-next-line @typescript-eslint/ban-types
type TypeFunction = Function
import { hasConstructor, hasOwnProperty, isSomething } from './utils';

function compareMagnitudes(len: Exclude<magnitudeOptions,number>, length: number): boolean {
	if ('min' in len) {
		if (typeof len.min === 'string') len.min = parseInt(len.min);
		if (typeof len.min === 'number' && length < len.min) return false;
	} 
	if ('max' in len) {
		if (typeof len.max === 'string') len.max = parseInt(len.max);
		if (typeof len.max === 'number' && length > len.max) return false;
	} 
	return true;
}

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
	required(value: unknown, ctx: rec | empty, required: boolean): value is true {
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
	type(value: unknown, ctx: rec | empty, name: typeOf_Key | TypeFunction ): boolean {
		if (value === null || value === undefined) return true;
		if (typeof name === 'function' && value !== null && isSomething(value) && hasConstructor(value)) {
			return value['constructor'] === name;
		}
		return typeOf(value) === name;
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
	length(value: string | unknown[] | null | undefined, ctx: rec | empty, len: magnitudeOptions): boolean {
		if (value === null || value === undefined) return true;
		if (typeof len === 'number') {
			return value.length === len;
		}
		return compareMagnitudes(len,value.length);
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
	size(value: number | null | undefined, ctx: rec | empty, size: magnitudeOptions): boolean {
		if (value === null || value === undefined) return true;
		if (typeof size === 'number') {
			return value === size;
		}
		return compareMagnitudes(size,value);
	},

	/**
   * Validates enums.
   *
   * @param {String} value the string being validated
   * @param {Object} ctx the object being validated
   * @param {Array} enums array with allowed values
   * @return {Boolean}
   */
	enum(value: unknown, ctx: rec | empty, enums: unknown[]): boolean {
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
	match(value: string | null | undefined, ctx: rec | empty, regexp: RegExp): boolean {
		if (value === null || value === undefined) return true;
		return regexp.test(value);
	},
};

export default Validators;
export type ValidatorProps = typeof Validators & Record<string,ValidationFunction>;
