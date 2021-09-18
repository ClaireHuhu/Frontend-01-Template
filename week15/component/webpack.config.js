const path = require('path');

module.exports = {
  entry: './main.js',
  module: {
      rules: [
          {
              test:/\.js$/,
              use: {
                  loader: 'babel-loader',
                  options: {
                      presets: ['@babel/preset-env'],
                      plugins: [
                          ["@babel/plugin-transform-react-jsx",{"pragma":'create'}]
                        ]   //jsx语法糖默认配置为 React.createElement(Div...) 通过pragma配置
                  }
              }
          },{
              test: /\.view$/,
              use: {
                  loader: require.resolve('./myLoader.js')
              }
          }
      ]
  },
  mode: 'development',
  optimization: {
      minimize: false
  }
};