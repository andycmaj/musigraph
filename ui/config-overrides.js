const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const { compose, injectBabelPlugin, paths } = require('react-app-rewired');
const rewireAliases = require('react-app-rewire-aliases');
const path = require('path');

const createRewire = plugin => (config, env) =>
  injectBabelPlugin(plugin, config);

const alias = rewireAliases.aliasesOptions({
  // 'react-dom': '@hot-loader/react-dom',
  'redux-audio': path.resolve(__dirname, `${paths.appSrc}/redux-audio/src`),
});

module.exports =
  process.env.NODE_ENV === 'production'
    ? compose(
        alias,
        createRewire(
          '@quickbaseoss/babel-plugin-styled-components-css-namespace'
        ),
        createRewire('styled-components')
      )
    : compose(
        rewireReactHotLoader,
        alias,
        createRewire(
          '@quickbaseoss/babel-plugin-styled-components-css-namespace'
        ),
        createRewire('styled-components')
      );
