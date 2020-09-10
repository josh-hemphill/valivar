import ts from '@wessberg/rollup-plugin-ts';
import { allModuleTypes } from './rollupUtils';
const dist = './dist/';

const plugins = [
	ts({
		transpiler: 'babel',
		include: ['lib/**/*.ts'],
		transpileOnly:true,
		browserslist: false,
		tsconfigOverride: {
			compilerOptions: {
				rootDir: './lib',
			},
			declarationDir: './dist',
		},
	}),
];

export default [
	{
		input: 'lib/schema.ts',
		output: allModuleTypes(dist, 'valivar'),
		plugins,
	},
	{
		input: 'lib/dot.ts',
		output: allModuleTypes(dist, 'dot'),
		plugins,
	},
	{
		input: 'lib/typecast.ts',
		output: allModuleTypes(dist, 'typecast'),
		plugins,
	},
];
