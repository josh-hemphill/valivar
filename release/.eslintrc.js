'use strict';
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
	],
	env: {
		commonjs: true,
		es2020: true,
		node: true,
	},
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	'rules': {
		'quotes': [
			'warn',
			'single',
			{
				'avoidEscape': true,
				'allowTemplateLiterals': true,
			},
		],
		'semi': [
			'warn',
			'always',
			{
				'omitLastInOneLineBlock': true,
			},
		],
		'linebreak-style': [
			'warn',
			'unix',
		],
		'indent': [
			'warn',
			'tab',
		],
		'comma-dangle': [
			'warn',
			'always-multiline',
		],
		'no-tabs': [
			'warn',
			{
				'allowIndentationTabs': true,
			},
		],
		'space-before-function-paren': [
			'error',
			'never',
		],
		'eqeqeq': [
			'error',
			'always',
		],
		'no-return-assign': 0,
		'no-console': 'warn',
		'no-debugger': 'warn',
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'script',
		ecmaFeatures: {
			impliedStrict: false,
		},
	},
};
