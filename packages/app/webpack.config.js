/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const BUILD_DIR = path.resolve(__dirname, '../../dist');
const APP_DIR = path.resolve(__dirname, 'app');
const RESOURCES_DIR = path.resolve(__dirname, 'resources');

const UI_DIR = path.resolve(__dirname, '..', 'ui');
const VENDOR_DIR = path.resolve(__dirname, 'node_modules');

const buildIncludedPaths = () => {
  const paths = [];
  const modules = ['core', 'i18n', 'ui'];
  const srcs = ['src', 'lib', 'index.js', 'index.ts'];
  modules.forEach(module => {
    srcs.forEach(src => {
      paths.push(path.resolve(__dirname, 'node_modules', '@nuclear', module, src));
    });
  });
  return paths;
};
const NUCLEAR_MODULES = buildIncludedPaths();

module.exports = (env) => {
  const IS_PROD = env.NODE_ENV === 'production';
  const IS_DEV = env.NODE_ENV === 'development';

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
    test: /\.(js|jsx|tsx|ts)$/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        ['@babel/preset-env', {
          targets: {
            electron: '4.2'
          }
        }],
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread'
      ],
      ignore: [/node_modules\/(?!@nuclear).*/]
    }
  };
  const contentSecurity = 'connect-src *; style-src \'unsafe-inline\' https:; font-src https: data:; img-src https: data: file:;';
  const plugins = [
    new HtmlWebpackPlugin({
      meta: {
        charset: {
          charset: 'UTF-8'
        },
        'Content-Security-Policy': {
          'http-equiv': 'Content-Security-Policy',
          content: IS_DEV
            ? `${contentSecurity} script-src 'unsafe-eval' 'unsafe-inline' localhost:8080`
            : contentSecurity
        }
      },
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
    new webpack.DefinePlugin(
      Object.entries(
        dotenv.parse(
          fs.readFileSync(path.resolve(__dirname, '../../.env'))
        )
      )
        .reduce((acc, [key, value]) => ({
          ...acc,
          [`process.env.${key}`]: JSON.stringify(value)
        }), {})
    )
  ];

  if (IS_PROD) {
    jsxRule.loader = 'ts-loader';
    jsxRule.options = {};
    jsxRule.include = [
      APP_DIR,
      ...NUCLEAR_MODULES
    ];
    jsxRule.exclude = [
      /node_modules\/electron-timber\/preload\.js/,
      /node_modules\/(?!@nuclear).*/
    ];
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
    resolve: {
      extensions: ['*', '.js', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        react: path.resolve(__dirname, 'node_modules/react'),
        'styled-component': path.resolve(__dirname, 'node_modules/styled-component')
      },
      symlinks: false
    },
    stats: 'errors-only',
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
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '[local]'
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.css/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'url-loader',
          include: [
            RESOURCES_DIR,
            APP_DIR,
            UI_DIR,
            VENDOR_DIR
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2|svg)$/,
          loader: 'url-loader',
          include: [
            UI_DIR,
            APP_DIR,
            VENDOR_DIR
          ]
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ]
    },
    plugins,
    target: 'electron-renderer'
  };

  if (IS_DEV) {
    config.devServer = {
      hot: true,
      contentBase: '/',
      publicPath: '/'
    };
  }


  return config;
};
