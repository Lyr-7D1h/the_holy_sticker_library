import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import sqlite3 from 'sqlite3'

declare module 'fastify' {
  interface FastifyInstance {
    db: sqlite3.Database
  }
}

const dbPlugin: FastifyPluginCallback = (fastify, _, done) => {
  if (!process.env.DB_PATH) fastify.log.debug('No DB_PATH given using ./lib.db')
  const db = new sqlite3.Database(process.env.DB_PATH || 'lib.db')

  db.serialize(() => {
    fastify.addHook('onClose', (fastify, done) => {
      db.close((err) => {
        if (err) fastify.log.error(err.message)
        done()
      })
    })

    db.on('error', (err) => {
      fastify.log.error(`Uncaught DB Error: ${err.message}`)
    })

    db.run('CREATE TABLE IF NOT EXISTS stickers (hash TEXT UNIQUE NOT NULL)')
    db.run(
      'CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT NOT NULL, hash TEXT NOT NULL)'
    )
    db.run(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, numberId TEXT UNIQUE NOT NULL, latestTag TEXT NOT NULL, createdAt TEXT NOT NULL)'
    )
    fastify.decorate('db', db)
    done()
  })
}

export default fp(dbPlugin, { name: 'db' })
