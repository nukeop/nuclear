const webpack = require('webpack');
const path = require('path');
const HappyPack = require('happypack');

module.exports = {
  entry: './main.js',
  output: {
    path: __dirname,
    filename: 'bundle.electron.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        use: 'happypack/loader?id=jsx',
        exclude: /node_modules/
      },
      {
        test: /.node$/,
        use: 'node-loader'
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HappyPack({
      id: 'jsx',
      loaders: [ 'babel-loader' ]
    }),
  ],
  node: {
    fs: "empty",
    __dirname: false,
    __filename: false
  },
  target: 'electron-main'
};
