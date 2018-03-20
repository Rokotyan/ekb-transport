import { join, resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

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
      'utils': resolve(__dirname, 'src/utils/'),
      'components': resolve(__dirname, 'src/components/'),
      'pages': resolve(__dirname, 'src/pages/'),
      'data': resolve(__dirname, 'data/'),
    },
    extensions: ['.js'],
  },
  externals: externals,
  devServer: {
    compress: true,
    port: 9000,
  },
};

const defaultEnv = { 'dev': false };

export default (env = defaultEnv) => {
  config.devtool = env.dev ? 'eval-source-map' : 'source-map';
  config.output = {
    path: absolute('dist'),
    library: 'transport',
    filename: env.dev ? 'dist/transport.js' : 'transport.js',
    publicPath: env.dev ? '/' : undefined,
  };

  config.plugins = [
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
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
      presets: env.dev ? [] : ['es2015', 'stage-0'],  // Transpile to ES5 on prod build
      plugins: ['transform-object-rest-spread'],
    },
  });

  if ( !env.dev ) {
    // Minify
    // config.plugins.push(
    //   new webpack.optimize.UglifyJsPlugin({
    //     // include: /\.min\.js$/,
    //     minimize: true,
    //   })
    // );
  }
  return config;
};
