import { Message } from 'venom-bot'
import HSL from 'whatsapp'

export interface User {
  id: number
  numberId: string
  latestTag: string
  createdAt: string
}

export default function register(hsl: HSL, message: Message): Promise<User> {
  const numberId = message.chat.contact.id

  function isNew(): Promise<User> {
    return new Promise((res, rej) => {
      hsl.client
        .sendText(numberId, 'Welcome to the Holy Sticker Library')
        .then(() => {
          hsl.fastify.db.run(
            'INSERT INTO users (numberId, latestTag, createdAt) VALUES (?, ?, ?)',
            [numberId, '', Date.now().toString()],
            function (err: Error) {
              if (err) return rej(err)

              const user: User = {
                id: this.lastID,
                numberId,
                latestTag: '',
                createdAt: Date.now().toString(),
              }
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
      (err, row: User) => {
        if (err) return rej(err)

        if (!row) {
          isNew()
            .then((user) => {
              res(user)
            })
            .catch(rej)
        } else {
          res(row)
        }
      }
    )
  })
}
