/* eslint-disable @typescript-eslint/no-var-requires */
const withCss = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([withCss, withFonts, withImages], {
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.module.noParse = /iconv-loader\.js/;
      config.module.rules.push({
        test: /\.(jsx?|gql|graphql|tsx?)$/,
        loader: 'eslint-loader',
        exclude: ['/node_modules/', '/.next/', '/helper_scripts/'],
        enforce: 'pre',
      });
    }

    if (isServer) {
      return config;
    }

    return config;
  },
});
