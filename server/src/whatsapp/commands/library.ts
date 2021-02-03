import { User } from 'whatsapp/register'
import { Tag } from '@shared/tag'

export default function library(user: User): void {
  user.hsl.fastify.db.all(
    'SELECT DISTINCT tag FROM tags',
    (err, rows: Tag[]) => {
      if (err) user.hsl.fastify.log.error(err.message)
      user.sendText(rows.map((t) => t.tag).join('\n'))
    }
  )
}
