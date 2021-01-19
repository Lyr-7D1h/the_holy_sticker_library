import { FastifyInstance, FastifyPluginCallback } from "fastify"

const library: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  interface LibraryData {
    limit: number
  }

  fastify.addSocketHandler("library/getStickers", (data) => {
    if (
      (data as LibraryData).limit &&
      typeof (data as LibraryData).limit === "number"
    ) {
      // return new Promise((res, rej) => {
      //   fastify.db.all(
      //     "SELECT * FROM stickers LIMIT ?",
      //     [data.limit],
      //     (err, rows) => {
      //       if (err) rej(err)
      //       res(rows)
      //     }
      //   )
      // })
    }
    return Promise.reject()
  })
  done()
}

export default library
