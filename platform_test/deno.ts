import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { dot, Schema, typecast } from "../mod.ts";

Deno.test("Validate Module Imported", function () {
  assertEquals(Schema.name, "Schema");
});

Deno.test("Dot available", function () {
  assertEquals(dot.name, "Dot");
});
Deno.test("Typecast available", function () {
  assertEquals(typecast.name, "Typecast");
});
