import { FastifyInstance, FastifyPluginCallback } from "fastify"

const library: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.addSocketHandler("library/getStickers", (data) => {
    if ("limit" in data) {
      // TODO: check limit >100
      return new Promise((res, rej) => {
        fastify.db.all(
          "SELECT * FROM stickers LIMIT ?",
          [data.limit],
          (err, rows) => {
            if (err) rej(err)
            res(rows)
          }
        )
      })
    }
    return Promise.reject()
  })
  done()
}

export default library
