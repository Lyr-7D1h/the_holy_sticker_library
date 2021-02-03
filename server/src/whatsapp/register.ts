import { join } from 'path'
import { Message, SendStickerResult } from 'venom-bot'
import HSL from 'whatsapp'

const STICKER_PATH = join(__dirname, '../../../resources/stickers')

export interface DatabaseUser {
  id: number
  numberId: string
  latestTag: string
  createdAt: string
}

export class User {
  hsl: HSL
  id: number
  numberId: string
  latestTag: string
  createdAt: Date

  constructor(
    hsl: HSL,
    id: number,
    numberId: string,
    lastestTag: string,
    createdAt: string
  ) {
    this.hsl = hsl
    this.id = id
    this.numberId = numberId
    this.latestTag = lastestTag
    this.createdAt = new Date(createdAt)
  }

  sendText(content: string): Promise<Message> {
    return this.hsl.client.sendText(this.numberId, content)
  }

  sendSticker(hash: string): Promise<false | SendStickerResult> {
    return this.hsl.client.sendImageAsSticker(
      this.numberId,
      join(STICKER_PATH, hash + '.webp')
    )
  }
}

export default function register(hsl: HSL, message: Message): Promise<User> {
  const numberId = message.chat.contact.id || message.from

  function isNew(): Promise<User> {
    return new Promise((res, rej) => {
      hsl.client
        .sendText(
          numberId,
          'Welcome to the Holy Sticker Library\nWrite `help` or `h` for a list of commands'
        )
        .then(() => {
          const currentDate = Date.now().toString()
          hsl.fastify.db.run(
            'INSERT INTO users (numberId, latestTag, createdAt) VALUES (?, ?, ?)',
            [numberId, '', currentDate],
            function (err: Error) {
              if (err) return rej(err)

              const user: User = new User(
                hsl,
                this.lastID,
                numberId,
                '',
                currentDate
              )
              res(user)
            }
          )
        })
        .catch(rej)
    })
  }

  return new Promise((res, rej) => {
    hsl.fastify.db.get(
      'SELECT * FROM users WHERE numberId=?',
      [numberId],
      (err, row: DatabaseUser) => {
        if (err) return rej(err)

        if (!row) {
          isNew()
            .then((user) => {
              res(user)
            })
            .catch(rej)
        } else {
          const user = new User(
            hsl,
            row.id,
            row.numberId,
            row.latestTag,
            row.createdAt
          )
          res(user)
        }
      }
    )
  })
}
