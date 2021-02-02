import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import { AuthenticateRequest, AuthenticateResponse } from '@shared/auth'

const library: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  if (!process.env.PASSWORD) fastify.log.warn('Password not set')

  /**
   * Stickers
   */

  fastify.addSocketHandler(
    AuthenticateRequest.type,
    (event: AuthenticateRequest) => {
      if (
        event.payload.username === 'hsl' &&
        event.payload.password === process.env.PASSWORD
      ) {
        return Promise.resolve(new AuthenticateResponse(true))
      } else {
        return Promise.resolve(new AuthenticateResponse(false))
      }
    }
  )
  done()
}

export default library
