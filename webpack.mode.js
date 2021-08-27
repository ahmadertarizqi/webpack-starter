const path = require('path');

const developmentConfig = {
  mode: 'development',
  devServer: {
    hot: "only",
    static: {
      directory: path.resolve(__dirname, 'dist'),
      staticOptions: {},
      watch: true,
    },
  },
};

const productionConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
};

module.exports = { developmentConfig, productionConfig };
