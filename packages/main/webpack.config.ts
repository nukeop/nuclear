import webpack from 'webpack';
import os from 'os';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

interface BuildEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  TARGET?: 'linux' | 'windows' | 'mac';
}

const osMapper: Record<string, BuildEnv['TARGET']> = {
  linux: 'linux',
  darwin: 'mac',
  win32: 'windows'
};

const MAIN_DIR = path.resolve(__dirname, 'src');
const CORE_DIR = path.resolve(__dirname, '..', '..', 'node_modules', '@nuclear', 'core', 'src');
const SCANNER_DIR = path.resolve(__dirname, '..', '..', 'node_modules', '@nuclear', 'scanner');
const SCANNER_DIR_SYMLINKED = path.resolve(__dirname, 'node_modules', '@nuclear', 'scanner');

module.exports = (env: BuildEnv): webpack.Configuration => {
  if (!env.TARGET) {
    env.TARGET = osMapper[os.platform() as string];
  }

  const IS_PROD = env.NODE_ENV === 'production';
  const outputDir = IS_PROD ? '../../dist' : './build';

  return {
    entry: './src/main.ts',
    resolve: {
      extensions: ['.ts', '.js', '.json', '.node'],
      alias: {
        jsbi: path.resolve(__dirname, '..', '..', 'node_modules', 'jsbi', 'dist', 'jsbi-cjs.js')
      },
      fallback: {
        fs: false
      },
      symlinks: false
    },
    externals: {
      'sqlite3': 'commonjs sqlite3',
      '@nuclear/scanner': 'commonjs ./scanner.node'
    },
    output: {
      path: path.resolve(__dirname, outputDir),
      filename: 'main.js'
    },
    mode: IS_PROD ? 'production' : 'development',
    devtool: 'source-map',
    stats: 'errors-only',
    optimization: { moduleIds: 'named' },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          include: [MAIN_DIR, CORE_DIR],
          options: {
            allowTsInNodeModules: true
          }
        },
        {
          test: /\.node$/,
          use: 'node-loader',
          include: [MAIN_DIR, SCANNER_DIR, SCANNER_DIR_SYMLINKED]
        }
      ]
    },
    node: {
      __dirname: false,
      __filename: false
    },
    target: 'electron-main',
    plugins: [new CopyPlugin({
      patterns: [
        { from: 'preload.js' },
        { from: path.resolve(__dirname, '../../.env') },
        { from: path.resolve(SCANNER_DIR, 'index.node'), to: 'scanner.node' }
      ]
    }),
    new webpack.NormalModuleReplacementPlugin(/(.*)system-api(\.*)/, (resource) => {
      resource.request = resource.request.replace(/system-api/, `@${env.TARGET}/system-api`);
    })]
  };
};
