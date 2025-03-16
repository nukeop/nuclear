import { dirname, join } from "path";
const path = require('path');

module.exports = {
  stories: [
    '../stories/**/*.stories.js',
    '../stories/**/*.stories.tsx'
  ],

  addons: [
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel")
  ],

  core: {
    disableTelemetry: true // stop spying on me you parasites
  },

  webpackFinal: config => {
    // console.log(config.module.rules)
    // process.exit()
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          config.module.rules[0],
          config.module.rules[1],
          config.module.rules[2],
          config.module.rules[4],
          config.module.rules[5],
          config.module.rules[7],
          config.module.rules[10],
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
          }
        ]
      }
    };
  },

  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },

  docs: {
    autodocs: true
  }
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}