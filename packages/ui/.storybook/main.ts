import { dirname, join } from "path";

const webpackConfig = {
  stories: [
    '../stories/**/*.stories.js',
    '../stories/**/*.stories.tsx'
  ],
  addons: [
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
    {
      name: "@storybook/addon-styling-webpack",
      options: {
        rules: [
          {
            test: /\.s?css$/,
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
          }
        ]
      },
    }
  ],
  core: {
    disableTelemetry: true // stop spying on me you parasites
  },
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

export default webpackConfig;