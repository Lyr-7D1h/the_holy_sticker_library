import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import {
  GetTagsRequest,
  AddTagRequest,
  Tag,
  GetTagsResponse,
  AddTagResponse,
} from '@shared/tag'

const library: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
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
      fastify.db.all(
        'INSERT INTO stickers (tag, hash) VALUES (?, ?)',
        [event.payload.tag, event.payload.hash],
        (err, row: Tag) => {
          if (err) rej(err)
          res(new AddTagResponse(row))
        }
      )
    })
  })

  done()
}

export default library
