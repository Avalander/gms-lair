const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')


const htmlPage = (folder, name, chunks) =>
	new HtmlPlugin({
		template: path.join(folder, name),
		filename: name,
		chunks: chunks,
	})

module.exports = ({ base_dir, folders }) => ({
	entry: {
		main: path.resolve(folders.app, 'main.js'),
		register: path.resolve(folders.src, 'register.js'),
		login: path.resolve(folders.src, 'login.js'),
	},
	output: {
		path: folders.dist,
		filename: '[name].bundle.js',
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [[ 'env', {
						targets: {
							chrome: 67,
							firefox: 60,
						}
					}]],
					plugins: [
						[ 'transform-object-rest-spread', { useBuiltIns: true }],
					],
				}
			}
		}, {
			test: /\.png$/,
			use: {
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'images/',
				}
			}
		}, {
			test: /\.woff(2?)$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 10000,
					mimetype: 'application/font-woff',
				}
			}
		}, {
			test: /\.ttf/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 10000,
					mimetype: 'application/octet-stream',
				}
			}
		}, {
			test: /\.eot$/,
			use: {
				loader: 'file-loader',
			}
		}, {
			test: /\.svg/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 10000,
					mimetype: 'image/svg+xml',
				}
			}
		}]
	},
	plugins: [
		htmlPage(folders.app, 'index.html', [ 'main' ]),
		htmlPage(folders.src, 'register.html', [ 'register' ]),
		htmlPage(folders.src, 'login.html', [ 'login' ]),
	],
	resolve: {
		modules: [
			folders.app,
			folders.src,
			folders.shared,
			'node_modules',
		]
	},
})