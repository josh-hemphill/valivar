import { Schema as SchemaEsm } from "../dist/valivar.mjs";
console.log("Esm");
console.log(SchemaEsm.name);
import { Schema as SchemaCjs } from "../dist/valivar.cjs";
console.log("Cjs");
console.log(SchemaCjs.name);
import { Schema as SchemaUmd } from "../dist/valivar.js";
console.log("Umd");
console.log(SchemaUmd.name);
