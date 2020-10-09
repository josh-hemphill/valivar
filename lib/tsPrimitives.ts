import { Schema } from './schema';
import Property from './property';

export type fromString = string | number
export type key = PropertyKey;
export type nillish<T> = T | null;
export type numish = number | string | undefined
export type magnitudeOptions = number | {max:numish} | {min:numish} |  {min:numish, max:numish};
export const empty = {};
export type empty = typeof empty;
export type rec = Record<string, unknown>;
export type obj = Record<key, unknown>
export type arr = unknown[];

export type rule = obj|arr|string|Schema|Property|CallableFunction;
export type Falsy = false | 0 | '' | null | undefined;

export interface reportedTypes {
	date: string;
	regexp: string;
	arguments: string;
	array: string;
	error: string;
	map: string;
	null: string;
	undefined: string;
	nan: string;
	element: string;
	node: string;
	buffer: string;
	class: string;
	string: string;
	number: string;
	bigint: string;
	boolean: string;
	symbol: string;
	object: string;
	function: string;
}
export type typeOf_Key = keyof reportedTypes;
export type unknownFunction = (val: unknown) => unknown;
export type typecasters = {
	string(val: unknown): string;
	number(val: unknown): number;
	date(val: unknown): Date;
	array(val: unknown): Array<unknown>;
	boolean(val: unknown):  boolean;
	object(val: unknown): NonNullable<Record<string, unknown>> | typeof empty;
	[index: string]: unknownFunction;
}
export interface typecast {
	(val: unknown, type: string): ReturnType<typecastFunction>;
	casters: typecasters;
}

export type typecastFunction = typecasters[keyof typecasters]

export type hookFunction = (path: string, prop: Property) => void;

export interface ValidationFunction {
	(value: unknown, ctx: obj, ...args: unknown[]): boolean;
}
export type messageOpts = boolean | number | string | {args: messageOpts, fn: CallableFunction[]} | CallableFunction;
export type messageFunction = (prop: string, ctx: obj, ...options: messageOpts[]) => string;
export type argsTypes = CallableFunction | boolean | string | number | rec | arr | RegExp;
export type something =  boolean | string | number | arr | obj
export interface ValidationFunctionArr extends Array<argsTypes>{
	0: ValidationFunction;
	[index: number]: argsTypes;
}

export const enumerable: {
    (target: any, name: string): void;
    (target: any, name: string, desc: PropertyDescriptor): PropertyDescriptor;
} = (target: any, name: string, desc?: any) => {
	if(desc) {
		desc.enumerable = true;
		return desc;
	}
	Object.defineProperty(target, name,  {
		set(value) {
			Object.defineProperty(this, name, {
				value, enumerable: true, writable: true, configurable: true,
			});
		},
		enumerable: true,
		configurable: true,
	});
};
export const nonenumerable: {
    (target: any, name: string): void;
    (target: any, name: string, desc: PropertyDescriptor): PropertyDescriptor;
} = (target: any, name: string, desc?: any) => {
	if(desc) {
		desc.enumerable = false;
		return desc;
	}
	Object.defineProperty(target, name,  {
		set(value) {
			Object.defineProperty(this, name, {
				value, writable: true, configurable: true,
			});
		},
		configurable: true,
	});
};
