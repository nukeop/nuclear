const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=1&modules=true&localIdentName=[local]',
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
          path.resolve(__dirname, '../resources'),
          path.resolve(__dirname, '../node_modules/boxicons')
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=1&modules=true&localIdentName=[local]'
        ],
        include: [
          path.resolve(__dirname, '../resources'),
          path.resolve(__dirname, '../node_modules/boxicons')
        ]
      }
    ]
  }
};
