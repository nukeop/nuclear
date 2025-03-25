import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import 'webpack-dev-server';

const BUILD_DIR = path.resolve(__dirname, '../../dist');
const APP_DIR = path.resolve(__dirname, 'app');
const RESOURCES_DIR = path.resolve(__dirname, 'resources');

const UI_DIR = path.resolve(__dirname, 'node_modules', '@nuclear', 'ui');
const VENDOR_DIR = path.resolve(__dirname, '..', '..', 'node_modules');

const buildIncludedPaths = () => {
  const paths: string[] = [];
  const modules = ['core', 'i18n', 'ui'];
  const srcs = ['src', 'lib', 'index.js', 'index.ts'];
  modules.forEach((module) => {
    srcs.forEach((src) => {
      paths.push(
        path.resolve(
          __dirname, 
          '..', '..',
          'node_modules', '@nuclear', module, src
        )
      );
    });
  });
  return paths;
};
const NUCLEAR_MODULES = buildIncludedPaths();

module.exports = (env) => {
  const IS_PROD = env.NODE_ENV === 'production';
  const IS_DEV = env.NODE_ENV === 'development';

  const entry = IS_PROD
    ? path.resolve(APP_DIR, 'index.tsx')
    : [
      'react-hot-loader/patch',
      'webpack/hot/dev-server.js',
      'webpack-dev-server/client/index.js?hot=true&live-reload=true',
      path.resolve(APP_DIR, 'index.tsx')
    ];
  const output: webpack.Configuration['output'] = {
    path: BUILD_DIR,
    filename: '[name].[contenthash].js',
    sourceMapFilename: '[name].[contenthash].map',
    chunkFilename: '[id].[contenthash].js',
    globalObject: 'this'
  };
  const optimization: webpack.Configuration['optimization'] = {
    moduleIds: 'named' as const,
    minimize: false,
    splitChunks: false
  };
  const jsxRule: webpack.RuleSetRule = {
    test: /\.(js|jsx|tsx|ts)$/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              electron: '4.2'
            }
          }
        ],
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread'
      ],
      include: [APP_DIR, ...NUCLEAR_MODULES]
    }
  };
  
  const plugins: webpack.Configuration['plugins'] = [
    new HtmlWebpackPlugin({
      meta: {
        charset: {
          charset: 'UTF-8'
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
        dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../.env')))
      ).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [`process.env.${key}`]: JSON.stringify(value)
        }),
        {}
      )
    ),
    new webpack.ProvidePlugin({
      EventEmitter: ['events', 'EventEmitter']
    }),
    new webpack.ContextReplacementPlugin(
      /\/(@distube\/ytpl|@distube\/ytsr|bandcamp-scraper|http-cookie-agent|deasync)\//,
      false
    ),
    new webpack.ContextReplacementPlugin(
      /deasync/,
      path.resolve(__dirname, 'node_modules', 'deasync', 'index.js')
    )
  ];

  if (IS_PROD) {
    jsxRule.loader = 'ts-loader';
    jsxRule.options = {
      allowTsInNodeModules: true
    };
    jsxRule.include = [APP_DIR, ...NUCLEAR_MODULES];
    jsxRule.exclude = [
      /node_modules\/(?!@nuclear).*/
    ];
  } else {
    output.publicPath = '/';
    jsxRule.exclude = /node_modules\/(?!@nuclear).*/;
  }

  const config: webpack.Configuration = {
    entry,
    output,
    devtool: 'source-map',
    stats: 'errors-only',
    mode: IS_PROD ? 'production' : 'development',
    optimization,
    resolve: {
      extensions: ['.*', '.js', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        react: path.resolve(__dirname, '..', '..', 'node_modules', 'react'),
        'styled-component': path.resolve(
          __dirname,
          'node_modules/styled-component'
        )
      },
      fallback: {
        fs: false,
        http: false,
        zlib: false,
        stream: false,
        net: false,
        crypto: false,
        tls: false,
        path: false,
        https: false,
        os: false,
        events: false,
        'node:zlib': false,
        'node:assert': false
      },
      symlinks: false
    },
    externalsPresets: { node: true },
    externals: {
      bufferutil: 'commonjs bufferutil',
      'utf-8-validate': 'commonjs utf-8-validate',
      events: 'commonjs events'
    },
    module: {
      rules: [
        jsxRule,
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]',
                  exportLocalsConvention: 'as-is',
                  namedExport: false
                },
                esModule: true,
                importLoaders: 1
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.css/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: {
                  filter: (url: string) => !url.includes('charset=utf-8;;')
                }
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          type: 'asset/resource',
          include: [RESOURCES_DIR, APP_DIR, UI_DIR, VENDOR_DIR]
        },
        {
          test: /\.(ttf|eot|woff|woff2|svg)$/,
          type: 'asset/resource',
          include: [UI_DIR, APP_DIR, VENDOR_DIR]
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        },
        {
          test: /node_modules[/\\](iconv-lite)[/\\].+/,
          resolve: {
            aliasFields: ['main']
          }
        }
      ]
    },
    plugins,
    target: 'electron-renderer'
  };

  if (IS_DEV) {
    config.devServer = {
      hot: true,
      static: {
        publicPath: '/'
      },
      client: {
        overlay: false
      },
      watchFiles: ['../../packages/**/*.{js,jsx,ts,tsx}'],
      allowedHosts: 'all'
    };

    config.watchOptions = {
      ignored: ['node_modules', 'dist'],
      aggregateTimeout: 300,
      poll: 1000
    };
  }


  return config;
};
