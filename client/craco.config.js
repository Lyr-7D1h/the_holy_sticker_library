/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const cracoWebpackConfig = require('./craco.webpack.config')

module.exports = {
  plugins: [
    {
      plugin: cracoWebpackConfig,
    },
  ],
}
