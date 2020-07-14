'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

const PORT = 8988

module.exports = merge(baseConfig, {
  mode: 'development',

  output: {
    publicPath: '/'
  },

  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      // rewrites: [
      //   { from: /.*/, to: '/index.html' },
      // ],
      index: '/',
      disableDotRule: true,
      verbose: true
    },
    // historyApiFallback: true,
    hot: true,
    contentBase: 'dist',
    compress: true,
    // host: 'dev.gdp.fr',
    host: '0.0.0.0',
    port: PORT,
    disableHostCheck: true,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    quiet: false,
    // open: "firefox-developer-edition",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }, {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": "'dev'"
    })
  ]
})
