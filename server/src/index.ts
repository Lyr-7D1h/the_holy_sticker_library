import 'module-alias/register'
import fastifyAutoload from 'fastify-autoload'
import path from 'path'
import process from 'process'
import fastifySensible from 'fastify-sensible'
import pino from 'pino'
import fastifyStatic from 'fastify-static'
import Fastify from 'fastify'

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 5000

/*
 * Server Setup
 */

const fastify = Fastify({
  logger: pino({
    prettyPrint: process.env.NODE_ENV === 'development',
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  }),
  disableRequestLogging: true,
})

if (process.env.NODE_ENV === 'production') {
  fastify.setNotFoundHandler((_request, reply) => {
    reply.sendFile('index.html')
  })
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
  })
}

fastify
  .register(fastifySensible)

  .register(fastifyStatic, {
    root: path.join(__dirname, '../../resources'),
    decorateReply: process.env.NODE_ENV !== 'production',
    prefix: '/resources',
  })

  .register(fastifyAutoload, {
    dir: path.join(__dirname, './plugins'),
  })
  .after(() => {
    fastify.register(fastifyAutoload, {
      dir: path.join(__dirname, './resources'),
    })
  })

  .listen(PORT, HOST, (err) => {
    if (err) {
      fastify.log.error(err.message)
      process.exit(1)
    }
  })
