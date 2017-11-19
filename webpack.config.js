const path = require('path');

module.exports = {
	entry: './client-src/documents.js',
	output: {
		filename: 'documents.js',
		path: path.resolve(__dirname, 'resources')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
				}
			}
		]
	}
};