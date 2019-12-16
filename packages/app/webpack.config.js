const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require ('dotenv');

const BUILD_DIR = path.resolve(__dirname, '../../dist');
const APP_DIR = path.resolve(__dirname, 'app');
const RESOURCES_DIR = path.resolve(__dirname, 'resources');

const UI_DIR = path.resolve(__dirname, '..', 'ui');

module.exports = (env) => {
  const IS_PROD = env.NODE_ENV === 'production';
  const IS_DEV = env.NODE_ENV === 'development';
  // TODO remove this when env variable are set on the CI server
  dotenv.config({ path: path.resolve(__dirname, '.env') });

  const entry = IS_PROD
    ? path.resolve(APP_DIR, 'index.js')
    : [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      path.resolve(APP_DIR, 'index.js')
    ];
  const output = {
    path: BUILD_DIR,
    filename: 'renderer.js'
  };
  const optimization = {
    namedModules: true
  };
  const jsxRule = {
    test: /.jsx?$/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        ['@babel/preset-env', {
          targets: {
            electron: '4.2'
          }
        }],
        '@babel/preset-react'
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread'
      ],
      ignore: [/node_modules/]
    }
  };
  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      minify: {
        html5: true,
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true
      },
      inject: true
    }),
    new webpack.DefinePlugin({
      'process.env': Object.entries(dotenv.parse(path.resolve(__dirname, '.env')))
        .reduce((acc, [value, key]) => ({
          ...acc,
          [key]: JSON.stringify(value)
        }), {})
    })
  ];
  
  if (IS_PROD) {
    jsxRule.include = [
      APP_DIR,
      UI_DIR
    ];
    jsxRule.exclude = /node_modules\/electron-timber\/preload\.js/;
    optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    };
  } else {
    output.publicPath = '/';
    jsxRule.exclude = /node_modules\/(?!@nuclear).*/;
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  const config = {
    entry,
    output,
    mode: IS_PROD ? 'production' : 'development',
    optimization,
    stats: 'minimal',
    node: {
      fs: 'empty'
    },
    module: {
      rules: [
        jsxRule,
        {
          test: /.scss$/,
          use: [
            'style-loader',
            'css-loader?importLoaders=1&modules&localIdentName=[local]!sass-loader'
          ]
        },
        {
          test: /\.css/,
          loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
        }, {
          test: /\.(png|jpg|gif)$/,
          loader: 'url-loader',
          include: [
            RESOURCES_DIR,
            UI_DIR
          ]
        }, {
          test: /\.(ttf|eot|woff|woff2|svg)$/,
          loader: 'url-loader',
          include: UI_DIR
        }, {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ]
    },
    plugins,
    target: 'electron-renderer'
  };

  if (IS_DEV) {
    config.devServer =  {
      hot: true,
      contentBase: '/',
      publicPath: '/'
    };
  }

  return config;
};
