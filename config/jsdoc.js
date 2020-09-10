
module.exports = {
	'opts': {
		'encoding': 'utf8',
		'destination': 'docs/',
		'readme': 'docs-src/readme.md',
		'recurse': true,
		'verbose': true,
		'tutorials': './docs-src/examples',
		'template': 'node_modules/better-docs',
	},
	'tags': {
		'allowUnknownTags': [
			'optional',
			'category',
		],
	},
	'plugins': [
		'node_modules/better-docs/typescript',
		'plugins/markdown',
		'node_modules/better-docs/category',
	],
	'source': {
		'include': [
			'./lib/dot.ts',
			'./lib/schema.ts',
			'./lib/typecast.ts',
		],
		'includePattern': '\\.(js|ts)$',
		'excludePattern': '(node_modules/|docs)',
	},
	'templates': {
		'cleverLinks': false,
		'monospaceLinks': false,
		'search': true,
		'default': {
			'staticFiles': {
				'include': [
					'./docs-src/static',
				],
			},
		},
		'better-docs': {
			'name': 'Valivar - Javascript/Typescript schema-based validation and sanitation',
			'logo': 'logo.png',
			'title': 'Valivar',
			'css': 'style.css',
			'head': `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
			<link rel="manifest" href="/site.webmanifest">
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#19c612">
			<meta name="msapplication-TileColor" content="#9f00a7">
			<meta name="theme-color" content="#ffffff">`,
			'trackingCode': 'tracking-code-which-will-go-to-the-HEAD',
			'hideGenerator': false,
			'navLinks': [
				{
					'label': 'Github',
					'href': 'https://github.com/josh-hemphill/valivar',
				},
				{
					'label': 'Playground',
					'href': 'https://codepen.io/josh-hemphill/pen/Rwaxbor/left/?editors=1010',
				},
			],
		},
	},
};
