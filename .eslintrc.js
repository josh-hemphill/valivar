module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
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
	},
};
