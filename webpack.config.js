const path = require('path');
const { merge } = require('webpack-merge');
const { developmentConfig, productionConfig } = require('./webpack.mode');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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

module.exports = ({ env }) => {
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
          test: /\.s[ac]ss$/i,
          use: [
            env !== 'prod' 
              ? 'style-loader' 
              : MiniCssExtractPlugin.loader,
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
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ].concat(htmlPlugins),
  };

  switch(env) {
    case 'dev':
      return merge(commonConfig, developmentConfig);
    case 'prod':
      return merge(commonConfig, productionConfig);
    default:
      throw new Error('No matching configuration was found!!');
  }
};