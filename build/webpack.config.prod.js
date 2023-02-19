'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// ERROR in vendor.js from UglifyJs
// RangeError: Maximum call stack size exceeded

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    publicPath: '/'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          // Eliminate comments
          comments: false,
          // remove warnings
          // warnings: false,
          minimize: false,
          mangle: false,
          compress: {
            // Drop console statements
            drop_console: true,
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }, {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new webpack.DefinePlugin({
      "process.env": "'prod'"
    })
  ]
})
