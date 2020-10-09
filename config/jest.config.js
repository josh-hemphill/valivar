const { jsWithTs } = require('ts-jest/presets');
module.exports = {
	'rootDir':'../',
	'preset': 'ts-jest/presets/js-with-ts',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	'testMatch': [
		'**/test/**/*.[tj]s',
	],
	'transform': {
		...jsWithTs.transform,
	},
	'coverageReporters': [
		'text-summary',
		'lcov',
	],
	'bail': true,
	globals: {
		'ts-jest': {
			
		},
	},
};
