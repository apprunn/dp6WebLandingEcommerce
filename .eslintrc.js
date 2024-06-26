// http://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
	},
	env: {
		browser: true,
	},
	extends: 'airbnb-base',
	// required to lint *.vue files
	plugins: ['html'],
	// check if imports actually resolve
	settings: {
		'import/resolver': {
			webpack: {
				config: 'build/webpack.base.conf.js',
			},
		},
	},
	// add your custom rules here
	rules: {
		'comma-dangle': 'off',
		'arrow-parens': ['off', 'off'], // Desactiva la regla o ajusta según tu preferencia
		'import/no-extraneous-dependencies': 'off', // Desactiva la regla import/no-extraneous-dependencies
		'no-mixed-operators': 'off', // Activar la regla no-mixed-operators
		indent: 'off', // Indentación con tabs
		'no-mixed-spaces-and-tabs': 'off', // Evitar mezcla de espacios y tabs
		// 'indent': ['error', 'tab'], // Indentación con tabs
		'max-len': [
			'error',
			{
				code: 120,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreComments: true, // Ignorar longitud de línea en comentarios largos
				ignoreUrls: true, // Ignorar longitud de línea en URLs largas
				ignoreRegExpLiterals: true, // Ignorar longitud de línea en expresiones regulares largas
				ignorePattern: '^[ \t]*<(\\w+)([^>]*)>(.|\n)*?<\\/\\1>', // Ignorar líneas dentro de JSX
				ignorePattern: '^\\s*\\{', // Ignorar líneas dentro de objetos de configuración largos
			},
		],
		// don't require .vue extension when importing
		'import/extensions': [
			'error',
			'always',
			{
				js: 'never',
				vue: 'never',
			},
		],
		// allow optionalDependencies
		'import/no-extraneous-dependencies': [
			'error',
			{
				optionalDependencies: ['test/unit/index.js'],
			},
		],
		'linebreak-style': ['error', 'windows'],
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'no-tabs': 0,
		// 'indent': 'off',
		// 'no-mixed-spaces-and-tabs': 'off',
		'linebreak-style': 0,
	},
};
