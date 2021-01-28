import {
  GetStickersRequest,
  GetStickersResponse,
  RemoveStickerRequest,
  RemoveStickerResponse,
} from '@shared/sticker'
import { Sticker } from '@shared/sticker'
import {
  GetTagsRequest,
  AddTagRequest,
  Tag,
  GetTagsResponse,
  AddTagResponse,
} from '@shared/tag'
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import { unlink } from 'fs'
import { join } from 'path'

const library: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  /**
   * Stickers
   */

  fastify.addSocketHandler(
    'library/getStickers',
    (event: GetStickersRequest) => {
      return new Promise((res, rej) => {
        const select = 'SELECT DISTINCT stickers.hash FROM stickers'
        const wheres = []
        const joins = []
        const args = []

        if (event.payload.noTag || event.payload.hasTag)
          joins.push('LEFT JOIN tags ON tags.hash = stickers.hash ')

        if (event.payload.noTag) wheres.push('tags.id IS NULL')

        if (event.payload.hasTag) {
          wheres.push(`LOWER(tags.tag) LIKE LOWER("%${event.payload.hasTag}%")`)
        }

        const where = wheres.length > 0 ? 'WHERE ' + wheres.join(' AND ') : ''
        const join = joins.length > 0 ? joins.join(' ') : ''

        args.push(event.payload.limit)
        const query = [select, join, where, 'LIMIT ?'].join(' ')

        fastify.db.all(query, args, (err, rows: Sticker[]) => {
          if (err) rej(err)
          res(new GetStickersResponse(rows))
        })
      })
    }
  )
  fastify.addSocketHandler(
    RemoveStickerRequest.type,
    (event: RemoveStickerRequest) => {
      return new Promise((res, rej) => {
        fastify.db.run(
          'DELETE FROM tags WHERE hash=?',
          [event.payload.hash],
          (err) => {
            if (err) rej(err)

            fastify.db.run(
              'DELETE FROM stickers WHERE hash=?',
              [event.payload.hash],
              (err) => {
                if (err) rej(err)
                unlink(
                  join(
                    __dirname,
                    `../../../resources/stickers/${event.payload.hash}.webp`
                  ),
                  (err) => {
                    if (err) rej(err)
                    res(new RemoveStickerResponse(event.payload.hash))
                  }
                )
              }
            )
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
