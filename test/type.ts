import { getType } from '../lib/type';
describe('Types',() => {
	describe('.getType()', () => {
		test('should have all builtin types', () => {
			expect(getType(new Date())).toBe('date');
			expect(getType(new RegExp('[a-z]'))).toBe('regexp');
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect(getType(arguments)).toBe('arguments');
			expect(getType(Array(2))).toBe('array');
			expect(getType(new Error())).toBe('error');
			// eslint-disable-next-line no-undef
			expect(getType(new Map())).toBe('map');
			expect(getType(null)).toBe('null');
			expect(getType( undefined)).toBe('undefined');
			expect(getType(NaN)).toBe('nan');
			// eslint-disable-next-line no-undef
			expect(getType(Buffer.from('hi'))).toBe('buffer');
			expect(getType(1)).toBe('number');
			expect(getType('hi')).toBe('string');
			expect(getType({})).toBe('object');
			expect(getType(true)).toBe('boolean');
			// eslint-disable-next-line no-undef
			expect(getType(Symbol('hi'))).toBe('symbol');
			// eslint-disable-next-line no-undef
			expect(getType(BigInt('1092384781902374901273984'))).toBe('bigint');
		});
		test('should return class reference as class', () => {
			class TestType {
			}
			expect(getType(TestType)).toBe('class');
		});
		test('should return browser types', () => {
			let localGlobal = {};
			try {
				localGlobal = globalThis;
			} catch (error) {
				localGlobal = global;
			}
			class Node {
				nodeName = 'hello'
				nodeType = 2
			}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			localGlobal.Node = Node;
			expect(getType(new Node())).toBe('node');
			class Element {
				nodeName = 'hello'
				nodeType = 1
			}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			localGlobal.HTMLElement = Element;
			expect(getType(new Element())).toBe('element');
		});
	});
});
