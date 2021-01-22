import { GetStickersEvent, StickersEvent } from '@shared/socket'
import { Sticker } from '@shared/types/library'
import { FastifyInstance, FastifyPluginCallback } from 'fastify'

const library: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.addSocketHandler('library/getStickers', (event: GetStickersEvent) => {
    return new Promise((res, rej) => {
      fastify.db.all(
        'SELECT * FROM stickers LIMIT ?',
        [event.payload.limit],
        (err, rows: Sticker[]) => {
          if (err) rej(err)
          res(new StickersEvent(rows))
        }
      )
    })
  })
  done()
}

export default library
