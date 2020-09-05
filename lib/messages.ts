/**
 * Default error messages.
 *
 * @private
 */
import { rec, empty } from './tsPrimitives';

const Messages = {
	// Type message
	type(prop: string, ctx: rec | empty, type: string | unknown): string {
		if (typeof type === 'function') {
			type = type.name;
		}

		return `${prop} must be of type ${type}.`;
	},

	// Required message
	required(prop: string): string {
		return `${prop} is required.`;
	},

	// Match message
	match(prop: string, ctx: rec | empty, regexp: string | RegExp): string {
		return `${prop} must match ${regexp}.`;
	},

	// Length message
	length(prop: string, ctx: rec | empty, len: number | {min?: number, max?: number}): string {
		if (typeof len === 'number') {
			return `${prop} must have a length of ${len}.`;
		}

		const { min, max } = len;

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
	size(prop: string, ctx: rec | empty, size: number | {min?: number, max?: number}): string {
		if (typeof size === 'number') {
			return `${prop} must have a size of ${size}.`;
		}

		const { min, max } = size;

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
	enum(prop: string, ctx: rec | empty, enums: PropertyKey[]): string {
		const copy = enums.slice();
		const last = copy.pop();
		return `${prop} must be either ${copy.join(', ')} or ${last?.toString()}.`;
	},

	// Illegal property
	illegal(prop: string): string {
		return `${prop} is not allowed.`;
	},

	// Default message
	default(prop: string): string {
		return `Validation failed for ${prop}.`;
	},
};

export default Messages;
