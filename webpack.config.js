const { join } = require('path')

const devMode = process.env.NODE_ENV != 'production'


/** @type {import('webpack').Configuration} */
const config = {
  entry: {
    index: './index.ts'
  },
  output: {
    path: join(__dirname),
    publicPath: '/',
    filename: '[name].js'
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
    ]
  }
  
}

module.exports = config