const webpack = require('webpack')
const merge = require('webpack-merge')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const common = require('./common')
const { version } = require('../package.json')


module.exports = ({ base_dir, folders }) => merge(common({ base_dir, folders }), {
	mode: 'production',
	module: {
		rules: [{
			test: /\.scss/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [ 'css-loader', {
					loader: 'sass-loader',
					options: {
						includePaths: [ folders.src ],
					}
				}]
			})
		}]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true,
		}),
		new webpack.DefinePlugin({
			$VERSION$: JSON.stringify(version),
		}),
	],
})