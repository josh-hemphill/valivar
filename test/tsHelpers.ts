import { enumerable, nonenumerable } from '../lib/tsPrimitives';

describe('ts property modifiers', () => {
	test('enumerable makes enumerable', () => {
		class obj {
			@enumerable
			hi: string
			@enumerable
			hello: Record<string, unknown>
			constructor() {
				this.hi = 'hello';
				this.hello = {hi:'hello'};
			}
		}
		const i = new obj();
		expect(Object.keys(i).length).toBe(2);
	});
	test('nonenumerable makes nonenumerable', () => {
		class obj {
			@nonenumerable
			hi: string
			@nonenumerable
			hello: Record<string, unknown>
			constructor() {
				this.hi = 'hello';
				this.hello = {hi:'hello'};
			}
		}
		const i = new obj();
		expect(Object.keys(i).length).toBe(0);
	});
});
