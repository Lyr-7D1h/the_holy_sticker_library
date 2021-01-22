/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* craco-plugin-log-webpack-config.js */
require('module-alias/register')
const package = require('./package.json')

module.exports = {
  overrideWebpackConfig: ({
    webpackConfig,
    cracoConfig,
    pluginOptions,
    context: { env, paths },
  }) => {
    webpackConfig.resolve.alias = package._moduleAliases || {}
    webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
      ({ constructor }) => !(constructor.name === 'ModuleScopePlugin')
    )

    // Always return the config object.
    return webpackConfig
  },
}
