const { join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlPugWebpackPlugin = require('html-webpack-pug-plugin')

const devMode = process.env.NODE_ENV != 'production'
const {version} = require('./package.json')

/** @type {import('webpack').Configuration} */
const config = {
  entry: {
    index: './index.tsx'
  },
  output: {
    path: join(__dirname),
    publicPath: './',
    filename: '[name].js?v='+(version || 1) 
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx', '.jsx', '.mjs']
  },
  mode: devMode ? 'development' : 'production',
  watch: devMode,
  devtool: devMode ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.(png|wav|mp3|ttf)$/,
        loader: 'url-loader'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'ts-loader'
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.pug$/,
        use: [
          "html-loader",
          {
            loader: "pug-html-loader",
            options: {
              "pretty":true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    require('autoprefixer'),
    new HtmlPugWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.pug'
    })
  ]
  
}

module.exports = config