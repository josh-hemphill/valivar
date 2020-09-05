// eslint-disable-next-line @typescript-eslint/no-explicit-any
function nonenumerable(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	target: any,
	propertyKey: string,
) {
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
export default class ValidationError extends Error {
	private defineProp = (prop: string, val:unknown | boolean | number) => {
		Object.defineProperty(this, prop, {
			enumerable: false,
			configurable: true,
			writable: true,
			value: val,
		});
	};
	constructor(message: string | undefined, path: unknown) {
		super(message);
		nonenumerable(this, 'defineProp');

		this.defineProp('path', path);
		this.defineProp('expose', true);
		this.defineProp('status', 400);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ValidationError);
		}
	}
}
