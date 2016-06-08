var path = require('path');

module.exports = {
  entry: {
    app: [ './src/js/app.js' ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/app.js'
  },
  devServer: {
    contentBase: 'dist/',
    inline: true,
    colors: true
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'] }
    ]
  }
};
