const path = require('path');

module.exports = {
  stories: [
    '../stories/**/*.stories.js',
    '../stories/**/*.stories.tsx'
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links'
  ],
  core: {
    disableTelemetry: true // stop spying on me you parasites
  },
  webpackFinal: config => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          config.module.rules[0],
          config.module.rules[2],
          {
            test: /\.s?css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: {
                    auto: /\.s?css/,
                    localIdentName: '[local]'
                  }
                }
              },
              'sass-loader'
            ],
            include: [
              path.resolve(__dirname, '../lib'),
              path.resolve(__dirname, '../stories'),
              path.resolve(__dirname, '../resources')
            ]
          },
          {
            test: /\.(ttf|eot|woff|woff2|svg)$/,
            loader: 'url-loader',
            include: [
              path.resolve(__dirname, '../resources')
            ]
          },
          {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            include: path.resolve(__dirname, '../resources')
          }
        ]
      }
    };
  }
};