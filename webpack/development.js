const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./common')


module.exports = ({ base_dir, folders }) => merge(common({ base_dir, folders }), {
	mode: 'development',
	module: {
		rules: [{
			test: /\.scss/,
			use: [ 'style-loader', 'css-loader', {
				loader: 'sass-loader',
				options: {
					includePaths: [ folders.src ],
				}
			}]
		}]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.SourceMapDevToolPlugin(),
		new webpack.DefinePlugin({
			$VERSION$: JSON.stringify(Date.now()),
		}),
	],
	devServer: {
		contentBase: folders.dist,
		compress: true,
		hot: true,
		stats: 'minimal',
		historyApiFallback: {
			index: '/index.html'
		},
		proxy: {
			'/api': 'http://localhost:3015',
		},
	},
})