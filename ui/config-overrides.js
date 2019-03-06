const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const { paths } = require('react-app-rewired');
const { addBabelPlugin, addWebpackAlias, override } = require('customize-cra');
const path = require('path');

console.log(
  'redux-audio',
  path.resolve(__dirname, `${paths.appSrc}/redux-audio/src`)
);

const aliases = addWebpackAlias({
  // 'react-dom': '@hot-loader/react-dom',
  'redux-audio': path.resolve(__dirname, `${paths.appSrc}/redux-audio/src`),
});

const plugins = addBabelPlugin(
  '@quickbaseoss/babel-plugin-styled-components-css-namespace',
  'styled-components'
);

module.exports =
  process.env.NODE_ENV === 'production'
    ? override(aliases, plugins)
    : override(rewireReactHotLoader, aliases, plugins);
