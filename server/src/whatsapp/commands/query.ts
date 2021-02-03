import { Sticker } from '@shared/sticker'
import { User } from 'whatsapp/register'
import { queryHelp } from './help'

export default function query(user: User, keywords: string[]): void {
  if (keywords.length === 0) {
    user.sendText(queryHelp)
    return
  }

  const likes = keywords
    .map((keyword) => `LOWER (tags.tag) LIKE LOWER("%${keyword}%")`)
    .join(' OR ')

  user.hsl.fastify.db.all(
    `SELECT DISTINCT stickers.hash FROM stickers LEFT JOIN tags ON tags.hash = stickers.hash WHERE ${likes}`,
    (err, rows: Sticker[]) => {
      if (err) user.hsl.fastify.log.error(err.message)

      rows.forEach((s) => {
        console.log(s)
        user.sendSticker(s.hash).catch((e) => {
          user.hsl.fastify.log.error(e)
        })
      })
    }
  )
}
