const path = require('path');
const { merge } = require('webpack-merge');
const { developmentConfig, productionConfig } = require('./webpack.mode');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  const templateResults = templateFiles.map(template => {
    const parts = template.split('.');
    const name = parts[0];
    const extension = parts[1];
    
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      minify: false,
    });
  });

  return templateResults;
};

const htmlPlugins = generateHtmlPlugins('./src/pug');

const commonConfig = {
  entry: [
    path.resolve(__dirname, './src/index.js')
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
        ],
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true,
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, './src/html/index.pug'),
    //   filename: 'index.html',
    //   minify: false,
    // }),
  ].concat(htmlPlugins),
};

module.exports = (env, args) => {
  switch(args.mode) {
    case 'development':
      return merge(commonConfig, developmentConfig);
    case 'production':
      return merge(commonConfig, productionConfig);
    default:
      throw new Error('No matching configuration was found!!');
  }
};