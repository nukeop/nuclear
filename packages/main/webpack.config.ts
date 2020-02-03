/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { NormalModuleReplacementPlugin } = require('webpack');
const os = require('os');

interface BuildEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  TARGET?: 'linux' | 'windows' | 'mac';
}

const osMapper: Record<string, BuildEnv['TARGET']> = {
  linux: 'linux',
  darwin: 'mac',
  win32: 'windows'
};

module.exports = (env: BuildEnv): import('webpack').Configuration => {
  if (!env.TARGET) {
    env.TARGET = osMapper[os.platform() as string];
  }

  const IS_PROD = env.NODE_ENV === 'production';
  const outputDir = IS_PROD ? '../../dist' : './build';

  const tsRule = {
    test: /.ts?$/,
    loader: 'ts-loader',
    exclude: /node_modules\/(?!@nuclear).*/,
    options: {
      configFile: path.join(__dirname, `/config/tsconfig.${env.TARGET}.json`)
    }
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
    externals: {
      sqlite3: 'commonjs sqlite3'
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
        { from: path.resolve(__dirname, '../../.env') }
      ]),
      new NormalModuleReplacementPlugin(/(.*)system-api(\.*)/, (resource: any) =>  {
        resource.request = resource.request.replace(/system-api/, `@${env.TARGET}/system-api`);
      })
    ]
  };
};
