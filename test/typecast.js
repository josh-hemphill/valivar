import { typecast } from '../lib/typecast';

describe('Typecast', () => {
	describe('when called', () => {
		test('should return result of own casters function', () => {
			typecast.casters.TestSelfFunction = (val) => val;
			expect(typecast('hi', 'TestSelfFunction')).toBe('hi');
		});
		test('should return error for not type of own casters', () => {
			typecast.casters.notAType = 0;
			expect(() => typecast('hi','notAType')).toThrow('cannot cast to notAType');
		});
	});
	describe('when a caster called', () => {
		describe('return their name\'s type', () => {
			test('string should convert all types to strings', () => {
				const t = 'string';
				expect(typecast(1, t)).toBe('1');
				expect(typecast(null, t)).toBe('');
				expect(typecast({x:2}, t)).toBe('{"x":2}');
				expect(typecast((val) => val, t)).toBe('(val) => val');
			});
			test('date should convert all types to dates', () => {
				const t = 'date';
				const epoch = new Date(0);
				expect(typecast(1, t)).toMatchObject(new Date(1));
				expect(typecast(null, t)).toMatchObject(epoch);
				expect(typecast({x:2}, t)).toMatchObject(epoch);
				expect(typecast((val) => val, t)).toMatchObject(epoch);
				expect(typecast(NaN, t)).toMatchObject(epoch);
				expect(typecast('July 4 1776', t)).toMatchObject(new Date('July 4 1776'));
			});
			test('array should convert all types to arrays', () => {
				const t = 'array';
				expect(typecast([2], t)).toMatchObject([2]);
				expect(typecast(1, t)).toMatchObject([1]);
				expect(typecast(null, t)).toMatchObject([]);
				expect(typecast({x:2}, t)).toMatchObject([{x:2}]);
				const fn = (val) => val;
				expect(typecast(fn, t)).toHaveProperty('0',fn);
				expect(typecast(NaN, t)).toMatchObject([NaN]);
				expect(typecast('July 4 1776', t)).toMatchObject(['July 4 1776']);
				expect(typecast('July, 4, 1776', t)).toMatchObject(['July','4','1776']);
			});
			test('object should convert all types to objects', () => {
				const t = 'object';
				expect(typecast(1, t)).toMatchObject({value:1});
				expect(typecast(null, t)).toMatchObject({});
				expect(typecast({x:2}, t)).toMatchObject({x:2});
				const fn = (val) => val;
				expect(typecast(fn, t)).toHaveProperty('value', fn);
				expect(typecast('{"x":2}', t)).toMatchObject({x:2});
			});
			test('boolean should convert all types to booleans', () => {
				const t = 'boolean';
				expect(typecast('0', t)).toBe(false);
				expect(typecast('hi', t)).toBe(true);
				expect(typecast(0, t)).toBe(false);
				expect(typecast(null, t)).toBe(false);
				expect(typecast({x:2}, t)).toBe(true);
				expect(typecast(false, t)).toBe(false);
			});
		});
	});
});
