import { User } from 'whatsapp/register'
import { tagHelp } from './help'

export default function tag(user: User, keywords: string[]): void {
  if (keywords.length === 0) {
    user.sendText(tagHelp)
    return
  }

  for (const k of keywords) {
    if (k.length === 0) {
      user.sendText('Can not have empty tags')
      return
    }
  }

  user.sendText(
    `Setting current tag listener to ${keywords.map((k) => `'${k}'`)}`
  )
  user.hsl.fastify.db.run(
    'UPDATE users SET latestTag = ? WHERE numberId = ?',
    [keywords.join(','), user.numberId],
    (err) => {
      if (err) user.hsl.fastify.log.error(err.message)
    }
  )
}
