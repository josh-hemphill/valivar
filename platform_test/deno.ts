import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { validate } from "../mod.ts";
Deno.test("Validate Module Imported", function () {
  assertEquals(validate.name, "Schema");
});

import { dot } from "../mod.ts";
Deno.test("Dot Module Imported", function () {
  assertEquals(dot.name, "Dot");
});

import { typecast } from "../mod.ts";
Deno.test("Typecast Module Imported", function () {
  assertEquals(typecast.name, "Schema");
});
