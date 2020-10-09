import { assign, isKeyAble, isLimitedKey, isIntegerLike, isNumberLike, isObjOrFn, hasOwnProperty, isSomething } from '../lib/utils';

describe('Utils', () => {
	describe('assign()', () => {
		test('should all items of "key" to "obj"', () => {
			const key = {'1':'hi'};
			const obj = {'1':'notHi'};
			assign(key, undefined, obj);
			expect(obj['1']).toBe('hi');
		});
	});
	describe('isKeyAble()', () => {
		test('should return true for all types that can be keys', () => {
			expect(isKeyAble('hi')).toBe(true);
			expect(isKeyAble(1)).toBe(true);
			expect(isKeyAble(Symbol('hi'))).toBe(true);
			expect(isKeyAble({})).toBe(false);
			expect(isKeyAble([])).toBe(false);
			expect(isKeyAble(null)).toBe(false);
			expect(isKeyAble(BigInt(123))).toBe(false);
		});
	});
	describe('isLimitedKey()', () => {
		test('should return true for strings and numbers', () => {
			expect(isLimitedKey('hi')).toBe(true);
			expect(isLimitedKey(1)).toBe(true);
			expect(isLimitedKey(Symbol('hi'))).toBe(false);
			expect(isLimitedKey({})).toBe(false);
			expect(isLimitedKey([])).toBe(false);
			expect(isLimitedKey(null)).toBe(false);
			expect(isLimitedKey(BigInt(123))).toBe(false);
		});
	});
	describe('isIntegerLike()', () => {
		test('should return true for all that can be coerced to an integer', () => {
			expect(isIntegerLike('12')).toBe(true);
			expect(isIntegerLike('hi')).toBe(false);
			expect(isIntegerLike(1)).toBe(true);
			expect(isIntegerLike(Symbol('hi'))).toBe(false);
			expect(isIntegerLike({})).toBe(false);
			expect(isIntegerLike([])).toBe(false);
			expect(isIntegerLike(null)).toBe(false);
			expect(isIntegerLike(BigInt(123))).toBe(true);
		});
	});
	describe('isNumberLike()', () => {
		test('should return true for all that can be coerced to a number', () => {
			expect(isNumberLike('12')).toBe(true);
			expect(isNumberLike('hi')).toBe(false);
			expect(isNumberLike(1)).toBe(true);
			expect(isNumberLike(Symbol('hi'))).toBe(false);
			expect(isNumberLike({})).toBe(false);
			expect(isNumberLike([])).toBe(false);
			expect(isNumberLike(null)).toBe(false);
			expect(isNumberLike(BigInt(123))).toBe(true);
		});
	});
	describe('isObjOrFn()', () => {
		test('should return true for all strings, pure objects, and functions', () => {
			expect(isObjOrFn('hi')).toBe(true);
			expect(isObjOrFn(1)).toBe(false);
			expect(isObjOrFn(String)).toBe(true);
			expect(isObjOrFn(()=>{return true})).toBe(true);
			expect(isObjOrFn(Symbol('hi'))).toBe(false);
			expect(isObjOrFn({})).toBe(true);
			expect(isObjOrFn([])).toBe(false);
			expect(isObjOrFn(null)).toBe(true);
			expect(isObjOrFn(BigInt(123))).toBe(false);
		});
	});
	describe('hasOwnProperty()', () => {
		test('should return true if "obj" has a property named the value of "prop"', () => {
			// @ts-expect-error purposely checking for behavior of incorrect type
			expect(hasOwnProperty('hi','length')).toBe(true);
			expect(hasOwnProperty({},'hi')).toBe(false);
			// @ts-expect-error purposely checking for behavior of incorrect type
			expect(hasOwnProperty(String, 'length')).toBe(true);
			// @ts-expect-error purposely checking for behavior of incorrect type
			expect(hasOwnProperty(()=>{return true},'name')).toBe(true);
			// @ts-expect-error purposely checking for behavior of incorrect type
			expect(hasOwnProperty(Symbol('hi'), 'hi')).toBe(false);
			expect(hasOwnProperty({hi: true},'hi')).toBe(true);
			// @ts-expect-error purposely checking for behavior of incorrect type
			expect(hasOwnProperty([1],0)).toBe(true);
			// @ts-expect-error purposely checking for behavior of incorrect type
			expect(hasOwnProperty([1],1)).toBe(false);
		});
	});
	describe('isSomething()', () => {
		test('should return true for all strings, pure objects, and functions', () => {
			expect(isSomething('hi')).toBe(true);
			expect(isSomething(1)).toBe(true);
			expect(isSomething(String)).toBe(false);
			expect(isSomething(()=>{return true})).toBe(false);
			expect(isSomething(Symbol('hi'))).toBe(false);
			expect(isSomething({})).toBe(true);
			expect(isSomething([])).toBe(true);
			expect(isSomething(null)).toBe(true);
			expect(isSomething(BigInt(123))).toBe(false);
		});
	});
});
