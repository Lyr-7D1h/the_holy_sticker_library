import { GetStickersRequest, GetStickersResponse } from '@shared/sticker'
import { Sticker } from '@shared/sticker'
import {
  GetTagsRequest,
  AddTagRequest,
  Tag,
  GetTagsResponse,
  AddTagResponse,
} from '@shared/tag'
import { FastifyInstance, FastifyPluginCallback } from 'fastify'

const library: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  /**
   * Stickers
   */

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

  /**
   * TAGS
   */

  fastify.addSocketHandler(GetTagsRequest.type, () => {
    return new Promise((res, rej) => {
      fastify.db.all('SELECT * FROM tags', (err, rows: Tag[]) => {
        if (err) rej(err)
        res(new GetTagsResponse(rows))
      })
    })
  })

  fastify.addSocketHandler(AddTagRequest.type, (event: AddTagRequest) => {
    console.log(event)
    return new Promise((res, rej) => {
      fastify.db.get(
        'SELECT * FROM tags WHERE hash=? AND tag=?',
        [event.payload.hash, event.payload.tag],
        (err, row) => {
          if (err) rej(err)
          if (row) {
            fastify.log.warn('Tag already exists', event.payload)
            return
          }
          fastify.db.run(
            'INSERT INTO tags (tag, hash) VALUES (?, ?)',
            [event.payload.tag, event.payload.hash],
            function (err: Error) {
              if (err) rej(err)
              const tag = Object.assign(event.payload, { id: this.lastID })
              res(new AddTagResponse(tag))
            }
          )
        }
      )
    })
  })

  done()
}

export default library
