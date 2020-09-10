import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import { valivar } from '../mod.ts';
Deno.test('Validate Module Imported', function() {
	assertEquals(valivar.name, 'Schema');
});

import { dot } from '../mod.ts';
Deno.test('Dot Module Imported', function() {
	assertEquals(dot.name, 'Dot');
});

import { typecast } from '../mod.ts';
Deno.test('Typecast Module Imported', function() {
	assertEquals(typecast.name, 'Schema');
});
