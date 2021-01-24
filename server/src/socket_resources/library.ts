import { GetStickersRequest, GetStickersResponse } from '@shared/sticker'
import { Sticker } from '@shared/sticker'
import { FastifyInstance, FastifyPluginCallback } from 'fastify'

const library: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.addSocketHandler(
    'library/getStickers',
    (event: GetStickersRequest) => {
      return new Promise((res, rej) => {
        fastify.db.all(
          'SELECT * FROM stickers LIMIT ?',
          [event.payload.limit],
          (err, rows: Sticker[]) => {
            if (err) rej(err)
            res(new GetStickersResponse(rows))
          }
        )
      })
    }
  )
  done()
}

export default library
