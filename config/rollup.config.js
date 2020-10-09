import ts from '@wessberg/rollup-plugin-ts';
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
		output: [
			{
				file: `${dist}valivar.cjs.js`,
				format: 'cjs',
				exports: 'auto',
			},
			{
				file: `${dist}valivar.cjs`,
				format: 'cjs',
				exports: 'auto',
			},
			{
				file: `${dist}valivar.esm.js`,
				format: 'es',
				exports: 'auto',
			},
			{
				file: `${dist}valivar.mjs`,
				format: 'es',
				exports: 'auto',
			},
			{
				name: 'valivar',
				file: `${dist}valivar.js`,
				format: 'umd',
				exports: 'auto',
			},
		],
		plugins,
	},
];
