module.exports = {
	'preset': 'ts-jest/presets/js-with-ts',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	'testMatch': [
		'/**/test/**/*.js',
	],
	'transform': {
		'\\.ts$': [
			'ts-jest',
		],
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
