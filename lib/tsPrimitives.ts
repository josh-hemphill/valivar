import { Schema } from './schema';
import Property from './property';
export {
	empty,
	rec,
	reportedTypes,
	typecast,
	typecastFunction,
	Falsy,
	typeOf_Key,
	nillish,
	numish,
	magnitudeOptions,
	key,
	obj,
	arr,
	rule,
	fromString,
	unknownFunction,
	typecasters,
	hookFunction,
	ValidationFunction,
	messageFunction,
	messageOpts,
	argsTypes,
	something,
};

type fromString = string | number
type key = PropertyKey;
type nillish<T> = T | null;
type numish = number | string | undefined
type magnitudeOptions = number | {min:numish, max:numish};
const empty = {};
type empty = typeof empty;
type rec = Record<string, unknown>;
type obj = Record<key, unknown>
type arr = unknown[];

type rule = obj|arr|string|Schema|Property;
type Falsy = false | 0 | '' | null | undefined;

interface reportedTypes {
	date: string;
	regexp: string;
	arguments: string;
	array: string;
	error: string;
	null: string;
	undefined: string;
	nan: string;
	element: string;
	buffer: string;
}
type typeOf_Key = keyof reportedTypes;
type unknownFunction = (val: unknown) => unknown;
type typecasters = {
	string(val: unknown): string;
	number(val: unknown): number;
	date(val: unknown): Date;
	array(val: unknown): Array<unknown>;
	boolean(val: unknown):  boolean;
	object(val: unknown): NonNullable<Record<string, unknown>> | typeof empty;
	[index: string]: unknownFunction;
}
interface typecast {
	(val: unknown, type: string): ReturnType<typecastFunction>;
	casters: typecasters;
}

type typecastFunction = typecasters[keyof typecasters]

type hookFunction = (path: string, prop: Property) => void;

interface ValidationFunction {
	(value: unknown, ctx: obj, ...args: unknown[]): boolean;
}
type messageOpts = boolean | number | string | {args: messageOpts, fn: CallableFunction[]} | CallableFunction;
type messageFunction = (prop: string, ctx: obj, ...options: messageOpts[]) => string;
type argsTypes = CallableFunction | boolean | string | number | rec | arr | RegExp;
type something =  boolean | string | number | arr | obj
