// import { getBabelOutputPlugin } from '@rollup/plugin-babel';
export const allModuleTypes = (dist, name) => ([
	{
		file: `${dist}${name}.cjs.js`,
		format: 'cjs',
		exports: 'auto',
	},
	{
		file: `${dist}${name}.esm.js`,
		format: 'es',
		exports: 'auto',
	},
	{
		name: name,
		file: `${dist}${name}.js`,
		format: 'umd',
		exports: 'auto',
	},
]
);
