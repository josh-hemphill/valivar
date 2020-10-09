import { dot } from '../lib/dot';

describe('Dot notation utils',()=> {
	test('should have name property "Dot"', () => {
		expect(dot.name).toBe('Dot');
	});
	
	describe('.set()', () => {
		test('should return the same non-object if passed as obj', () => {
			const sameSame = Symbol('sameSame');
			// @ts-expect-error Using invalid type to test
			expect(dot.set(sameSame, 'some.sub.prop',true)).toBe(sameSame);
		});
	});
	describe('.get()', () => {
		describe('should return void if non-object is passed as obj', () => {
			const sameSame = Symbol('sameSame');
			test('with path', () => {
				// @ts-expect-error Using invalid type to test
				expect(dot.get(sameSame, 'some.sub.prop')).toBe(undefined);
			});
			test('without path', () => {
				// @ts-expect-error Using invalid type to test
				expect(dot.get(sameSame, 'some')).toBe(undefined);
			});
		});
	});
	describe('.delete()', () => {
		test('should just return void if path is invalid for the type', () => {
			const arr = [1];
			expect(dot.delete(arr, 'length')).toBe(undefined);
			expect(dot.delete({arr}, 'arr.length')).toBe(undefined);
			expect(arr.length).toBeTruthy();
		});
		test('should remove array item at index', () => {
			const arr = [1];
			expect(dot.delete(arr, '0')).toBe(undefined);
			expect(arr[0]).toBe(undefined);
		});
	});
});
