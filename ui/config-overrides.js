const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const { compose, injectBabelPlugin, paths } = require('react-app-rewired');
const rewireAliases = require('react-app-rewire-aliases');
const path = require('path');

const createRewire = plugin => (config, env) =>
  injectBabelPlugin(plugin, config);

module.exports = compose(
  rewireReactHotLoader,
  rewireAliases.aliasesOptions({
    // 'react-dom': '@hot-loader/react-dom',
    'redux-audio': path.resolve(__dirname, `${paths.appSrc}/redux-audio/src`),
  }),
  createRewire('@quickbaseoss/babel-plugin-styled-components-css-namespace'),
  createRewire('styled-components')
);
