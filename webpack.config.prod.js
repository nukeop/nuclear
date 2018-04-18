const webpack = require('webpack');
const path = require('path');
const GoogleFontsPlugin = require("google-fonts-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HappyPack = require('happypack');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'app');
const RESOURCES_DIR = path.resolve(__dirname, 'resources');

const config = {
  entry: path.resolve(APP_DIR, 'index.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: BUILD_DIR
  },
  node: {
    fs: "empty"
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        use: 'happypack/loader?id=jsx',
        exclude: /node_modules/
      },
      {
        test: /.scss$/,
        use: 'happypack/loader?id=scss'
      }, {
        test: /\.css/,
        loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
      },  {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        include: RESOURCES_DIR
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HappyPack({
      id: 'jsx',
      loaders: [ 'babel-loader' ]
    }),
    new HappyPack({
      id: 'scss',
      loaders: [ 'style-loader!css-loader?importLoaders=1&modules&localIdentName=[local]!sass-loader' ]
    }),
    new UglifyJsPlugin(),
    new GoogleFontsPlugin({
      fonts: [
        {
          family: 'lato',
          variants: ['regular', '300', '700']
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  target: 'electron-renderer'
};

module.exports = config;
