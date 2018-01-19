const webpack = require('webpack');
const path = require('path');
const GoogleFontsPlugin = require("google-fonts-webpack-plugin");
const HappyPack = require('happypack');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'app');
const RESOURCES_DIR = path.resolve(__dirname, 'resources');

const config = {
  entry: [
    "react-hot-loader/patch",
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.resolve(APP_DIR, 'index.js')
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/'
  },
  devServer: {
    hot: true,
    contentBase: BUILD_DIR,
    publicPath: 'http://localhost:8080/'
  },
  node: {
    fs: "empty"
  },
  module: {
    loaders: [
      {
	test: /.jsx?$/,
	use: 'happypack/loader?id=jsx',
	include: APP_DIR
      },
      {
	test: /.scss$/,
	use: 'happypack/loader?id=scss'
      },
      {
        test: /\.css/,
        loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        include: RESOURCES_DIR
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new GoogleFontsPlugin({
      fonts: [
        {
          family: 'lato',
          variants: ['regular', '300', '700']
        }
      ]
    }),
    new HappyPack({
      id: 'jsx',
      loaders: [ 'babel-loader' ]
    }),
    new HappyPack({
      id: 'scss',
      loaders: [ 'style-loader!css-loader?importLoaders=1&modules&localIdentName=[local]!sass-loader' ]
    })
  ],
  target: 'electron-renderer'
};

module.exports = config;
