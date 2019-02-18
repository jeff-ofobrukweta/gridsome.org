const path = require('path')
const createBaseConfig = require('./createBaseConfig')

const resolve = p => path.resolve(__dirname, p)

module.exports = async app => {
  const isProd = process.env.NODE_ENV === 'production'
  const config = createBaseConfig(app, { isProd, isServer: true })
  const { outDir, serverBundlePath } = app.config

  config.entry('app').add(resolve('../../app/entry.server.js'))

  config.target('node')
  config.externals([/^vue|vue-router$/])
  config.devtool('source-map')

  config.optimization.minimize(false)
  config.output.libraryTarget('commonjs2')

  config.plugin('ssr-server')
    .use(require('./plugins/VueSSRServerPlugin'), [{
      filename: path.relative(outDir, serverBundlePath)
    }])

  await app.dispatch('chainWebpack', null, config, {
    context: app.context,
    isServer: true,
    isProd
  })

  return config
}
