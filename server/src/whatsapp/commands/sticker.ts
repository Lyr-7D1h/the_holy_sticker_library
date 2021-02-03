import { writeFile } from 'fs'
import crypto from 'crypto'
import { join } from 'path'
import { Message } from 'venom-bot'
import { User } from 'whatsapp/register'

const STICKERS_FOLDER = join(__dirname, '../../../../resources/stickers')
export default function sticker(user: User, message: Message): void {
  if (user.latestTag.length === 0) {
    user.sendText('You need a tag set using the "tag" command')
    return
  }

  user.hsl.client.decryptFile(message).then((buffer) => {
    const hash = crypto.createHash('md5').update(buffer).digest('hex')
    user.hsl.fastify.log.debug(
      `Adding sticker: ${hash} with tags ${user.latestTag} by ${user.numberId}`
    )
    writeFile(join(STICKERS_FOLDER, hash + '.webp'), buffer, (err) => {
      if (err) user.hsl.fastify.log.error(err.message)

      // sticker in db
      user.hsl.fastify.db.run(
        'INSERT INTO stickers (hash) VALUES (?)',
        [hash],
        (err) => {
          if (err) user.hsl.fastify.log.error(err.message)
        }
      )

      // add tags
      user.latestTag.split(',').forEach((tag) => {
        user.hsl.fastify.db.get(
          'SELECT * FROM tags WHERE hash=? AND tag=?',
          [hash, tag],
          (err, row) => {
            if (err) user.hsl.fastify.log.error(err.message)
            if (row) {
              user.hsl.fastify.log.warn(
                `Tag: '${tag}' already exists for ${hash}`
              )
              return
            }
            user.hsl.fastify.db.run(
              'INSERT INTO tags (tag, hash) VALUES (?, ?)',
              [tag, hash],
              function (err: Error) {
                if (err) user.hsl.fastify.log.error(err.message)

                user.sendText(`Added ${hash} with tags: ${user.latestTag}`)
              }
            )
          }
        )
      })
    })
  })
}
