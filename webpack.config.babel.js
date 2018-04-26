import { join, resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const { CommonsChunkPlugin } = webpack.optimize;

function absolute(...args) {
  return join(__dirname, ...args);
}

const rules = [{
  test: /\.(svg|jpg|png|gif)$/,
  loader: 'url-loader',
}, {
  test: /\.json$/,
  loader: 'json-loader',
}, {
  test: /\.csv$/,
  loader: 'csv-loader',
  options: {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
  },
}, {
  test: /\.scss$/,
  loader: 'style-loader!css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]!sass-loader?data=@import "./src/variables.scss";'
}];

const externals = { d3: 'd3' };

const config = {
  entry: [
    // 'babel-polyfill',
    'babel-regenerator-runtime',
    './src/index',
  ],
  module: {
    rules,
  },
  resolve: {
    alias: {
      utils: resolve(__dirname, 'src/utils/'),
      components: resolve(__dirname, 'src/components/'),
      pages: resolve(__dirname, 'src/pages/'),
      data: resolve(__dirname, 'data/'),
    },
    extensions: ['.js'],
  },
  externals,
  devServer: {
    compress: true,
  },
};

const defaultEnv = { dev: false };

export default (env = defaultEnv) => {
  config.devtool = env.dev ? 'eval-source-map' : 'source-map';
  config.output = {
    path: absolute('dist'),
    library: 'transport',
    filename: env.dev ? 'dist/transport.js' : 'transport.js',
    publicPath: env.dev ? '/' : undefined,
  };

  config.plugins = [
    // Handles creating an index.html file and injecting assets. necessary because assets
    // change name because the hash part changes. We want hash name changes to bust cache
    // on client browsers.
    new HtmlWebpackPlugin({
      template: 'src/index-template.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new CommonsChunkPlugin({
      path: absolute('dist'),
      filename: env.dev ? 'dist/transport-dependencies.js' : 'transport-dependencies.js',
      name: 'commons',
      minChunks: module => module.context && module.context.indexOf('node_modules') >= 0,
    }),
    // new BundleAnalyzerPlugin(),
  ];

  config.module.rules.push({
    test: /\.js?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
      presets: env.dev ? ['react'] : ['react', 'es2015', 'stage-0'], // Transpile to ES5 on prod build
      plugins: ['transform-object-rest-spread', 'react-hot-loader/babel'],
    },
  });

  if (env.dev) {
    config.plugins.push(new webpack.NamedModulesPlugin());
  } else {
    // Extracts the css from the js files and puts them on a separate .css file. this is for
    // performance and is used in prod environments. Styles load faster on their own .css
    // file as they dont have to wait for the JS to load.
    // config.plugins.push(new ExtractTextPlugin('bundle-[hash].min.css'));


    // Minify
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compressor: {
        warnings: false,
        screw_ie8: true
      },
    }));
  }
  return config;
};
