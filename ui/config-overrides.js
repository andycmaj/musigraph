const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const { compose, injectBabelPlugin } = require('react-app-rewired');

const createRewire = (plugin) => (config, env) =>
  injectBabelPlugin(plugin, config);

module.exports = compose(
  rewireReactHotLoader,
  createRewire('@quickbaseoss/babel-plugin-styled-components-css-namespace'),
  createRewire('styled-components')
);
