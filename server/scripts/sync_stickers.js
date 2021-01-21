/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 *
 * SYNCHRONIZE ALL STICKERS
 * RENAMES TO THE HASH OF THE CONTENTS OF EACH STICKER
 * IF NEEDED UPDATES DATABASE ENTRY FOR STICKER
 *
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database(path.join(__dirname, '../lib.db'))

const STICKERS_PATH = path.join(__dirname, '../../resources/stickers')

fs.readdir(STICKERS_PATH, (err, files) => {
  if (err) throw err

  db.serialize(() => {
    files.forEach((file) => {
      file = path.join(STICKERS_PATH, file)

      fs.readFile(file, function (err, data) {
        if (err) throw err
        const hash = crypto.createHash('md5').update(data, 'utf8').digest('hex')

        fs.rename(file, path.join(STICKERS_PATH, `${hash}.webp`), (err) => {
          if (err) throw err
          console.log(`Updating ${hash}`)
          db.run('INSERT INTO stickers (hash) VALUES (?)', [hash])
        })
      })
    })
  })
})
