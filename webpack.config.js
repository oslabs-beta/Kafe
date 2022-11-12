const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/client/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    mode: process.env.NODE_ENV,
   module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options:{
            presets: ['@babel/preset-env', '@babel/preset-react']
        }
      },
      {
        test:/\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|png)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        },
    ]
   },
   plugins: [
    new HtmlWebpackPlugin({
        template: './src/client/index.html'
    })
   ],
   resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
   },
   devServer: {
    static:{
        publicPath: '/build',
        directory: path.resolve(__dirname, 'build')
    },
    historyApiFallback: true,
    hot: true,
    proxy: {
        '*':"http://localhost:3000"
    }
   }
}