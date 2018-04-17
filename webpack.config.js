const webpack = require('webpack')
const Jarvis = require('webpack-jarvis')
const { resolve } = require('path')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin')

let config = {
  entry: './src/index.jsx',
  output: {
    path: resolve(__dirname, './public'),
    filename: 'app.js'
  },
  resolve: { // These options change how modules are resolved
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '.jpeg', '.jpg', '.gif', '.png', '.svg'], // Automatically resolve certain extensions
    alias: { // Create aliases
      '@images': resolve(__dirname, 'src/assets/images'),  // src/assets/images alias
      '@fonts': resolve(__dirname, 'src/assets/fonts'),  // src/assets/fonts alias
      '@styles': resolve(__dirname, 'src/scss')  // src/assets/scss alias
    }
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/, // files ending with .js
        exclude: /node_modules/, // exclude the node_modules directory
        loader: 'babel-loader' // use this (babel-core) loader
      },
      {
        test: /\.scss|css$/,
        use: ['css-hot-loader'].concat(ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader', 'postcss-loader']
        }))
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file-loader?context=src/assets/images/&name=images/[path][name].[ext]', {  // images loader
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true
            },
            gifsicle: {
              interlaced: false
            },
            optipng: {
              optimizationLevel: 4
            },
            pngquant: {
              quality: '75-90',
              speed: 3
            }
          }
        }],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin('style.css'),
    new Jarvis({
      port: 1337 // optional: set a port
    })
  ],
  devServer: {
    contentBase: resolve(__dirname, './public'),
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true
  },
  devtool: 'eval-source-map'
}

module.exports = config

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin(), // call the uglify plugin
    new OptimizeCSSAssets()
  )
}
