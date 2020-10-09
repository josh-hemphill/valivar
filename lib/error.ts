import { nonenumerable } from './tsPrimitives';

/**
 * Custom errors.
 *
 */
export default class ValidationError extends Error {
	@nonenumerable
	public path: unknown;
	@nonenumerable
	public expose: boolean;
	@nonenumerable
	public status: number;
	constructor(message: string | undefined, path: unknown) {
		super(message);

		this.path = path;
		this.expose = true;
		this.status = 400;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ValidationError);
		}
	}
}
