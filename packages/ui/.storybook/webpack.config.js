const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]'
              }
            }
          },
          'sass-loader'
        ],
        include: [
          path.resolve(__dirname, '../lib'),
          path.resolve(__dirname, '../stories')
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
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]'
              }
            }
          }
        ],
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
