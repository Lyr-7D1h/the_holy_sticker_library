import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import sqlite3 from 'sqlite3'

declare module 'fastify' {
  interface FastifyInstance {
    db: sqlite3.Database
  }
}

const dbPlugin: FastifyPluginCallback = (fastify, _, done) => {
  const db = new sqlite3.Database('lib.db')

  db.serialize(() => {
    fastify.addHook('onClose', (fastify, done) => {
      db.close((err) => {
        if (err) fastify.log.error(err.message)
        done()
      })
    })

    db.run('CREATE TABLE IF NOT EXISTS stickers (hash TEXT UNIQUE NOT NULL)')
    db.run(
      'CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT NOT NULL, hash TEXT NOT NULL)'
    )
    fastify.decorate('db', db)
    done()
  })
}

export default fp(dbPlugin, { name: 'db' })
