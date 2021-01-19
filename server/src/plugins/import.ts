import { FastifyInstance, FastifyPluginCallback } from "fastify"
import fp from "fastify-plugin"
import { readdir, stat } from "fs"
import { join } from "path"

/** Call all venom hooks */
function fastifyImport(fastify: FastifyInstance, directory: string) {
  readdir(directory, (err, files) => {
    if (err) fastify.log.error(err.message)

    files.forEach((file) => {
      const filePath = join(directory, file)
      stat(filePath, (err, stats) => {
        if (err) fastify.log.error(err.message)

        const imports = []
        if (stats.isFile()) {
          imports.push(import(join(directory, file)))
        }

        Promise.all(imports)
          .then((imports) => {
            imports.forEach((imp) => imp.default(fastify))
          })
          .catch((err) => fastify.log.error(err))
      })
    })
  })
}

declare module "fastify" {
  interface FastifyInstance {
    import: (directory: string) => void
  }
}

const fastifyImportPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.decorate("import", (directory: string) => {
    fastifyImport(fastify, directory)
  })
  done()
}

export default fp(fastifyImportPlugin, { name: "import" })
