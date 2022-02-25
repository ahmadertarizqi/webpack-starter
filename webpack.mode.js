const path = require('path');
const Dotenv = require('dotenv-webpack');

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
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env.development'),
    })
  ]
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
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env.production'),
    })
  ]
};

module.exports = { developmentConfig, productionConfig };
