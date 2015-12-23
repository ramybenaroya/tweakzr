var webpack = require('webpack');
var isDevelopment = process.env.NODE_ENV !== 'production';
var isProduction = !isDevelopment;

var prefix = [
	'(function(){',
	'	var scr = document.createElement("script");',
	'	scr.textContent = "(" + function () {'
].join('\n');

var suffix = [
	'	} + ")();";',
	'	(document.head || document.documentElement).appendChild(scr);',
	'	scr.parentNode.removeChild(scr);',
	'})();'
].join('\n');

var plugins = [
        new webpack.DefinePlugin({
            NODE_ENV: process.env.NODE_ENV === "production" ? '"production"' : '"development"'
        })
    ].concat(isDevelopment ? [] :
    [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({minimize: true, compress: {warnings: false}}),
        new webpack.optimize.AggressiveMergingPlugin()
    ]);

module.exports = {
	entry: "./src/bg/index.js",
	output: {
		path: './extension/src/bg',
		filename: "background.js"
	},
	module: {
		preLoaders: [{
			test: /\.js$/,
			loader: "eslint-loader",
			exclude: /node_modules/
		}],
		loaders: [{
			test: /\.css$/,
			loader: "style!css!autoprefixer"
		}, {
			test: /\.js?$/,
			loader: 'babel'
		}]
	},
	plugins: plugins
};