const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
// Optional: if you need to merge non-module files
// const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
// const mergedFiles = require('./merged-files');

// Optional: if you need to copy files into the dist folder
// const CopyWebpackPlugin = require('copy-webpack-plugin');

// Cleans up folders
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Setup the Plugins
const cleanPlugin = new CleanWebpackPlugin(['dist']);

function resolve(dir) {
	return path.join(__dirname, '..', dir);
}

module.exports = {
	entry: {
		app: './coolest_app/static/src/vue/app.js',
		sample_sass: './coolest_app/static/src/scss/all.scss',
	},
	output: {
		path: config.build.assetsRoot,
		filename: 'js/[name].bundle.js',
		publicPath: process.env.NODE_ENV === 'production'
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath,
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': resolve('src'),
			'vue$': 'vue/dist/vue.esm.js',
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [resolve('src'), resolve('test')],
				options: {
					formatter: eslintFriendlyFormatter,
				},
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig,
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')],
			},
			{
				test: /\.(png|jpe?g|gif)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]'),
				}
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader',
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]'),
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
				},
			},
		],
	},
	plugins: [
		cleanPlugin,
		// Optional: if you need to copy files into the dist folder
		// new CopyWebpackPlugin([
		// 	{
		// 		from: './coolest_app/static/folder_name',
		// 		to: 'js',
		// 	},
		// ]),
		// Optional: if you need to merge non-module files
		// new MergeIntoSingleFilePlugin({
		// 	files: mergedFiles,
		// }),
	],
};