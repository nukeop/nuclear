const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env: { NODE_ENV: string }): import('webpack').Configuration => {
  const IS_PROD = env.NODE_ENV === 'production';
  const outputDir = IS_PROD ? '../../dist' : './build';

  const tsRule = {
    test: /.ts?$/,
    loader: 'ts-loader',
    exclude: /node_modules\/(?!@nuclear).*/
  };

  if (IS_PROD) {
    delete tsRule.exclude;
  }

  return {
    entry: './src/main.ts',
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        jsbi: __dirname + '/node_modules/jsbi/dist/jsbi-cjs.js'
      }
    },
    output: {
      path: path.resolve(__dirname, outputDir),
      filename: 'main.js'
    },
    mode: IS_PROD ? 'production' : 'development',
    stats: 'errors-only',
    optimization: { namedModules: true },
    module: {
      rules: [
        tsRule,
        {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    },
    node: {
      fs: 'empty',
      __dirname: false,
      __filename: false
    },
    target: 'electron-main',
    plugins: [
      new CopyPlugin([
        { from: 'preload.js' },
        { from: path.resolve(__dirname, '.env') }
      ])
    ]
  };
};
