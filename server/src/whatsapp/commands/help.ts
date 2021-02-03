import { User } from 'whatsapp/register'
export const queryHelp = `Query: Find a sticker with given keywords.
  [q or query] keywords
  keywords - list of words seperated by , or ; `

export const tagHelp = `Tag: Set tags for the stickers you want to get saved.
  [t or tag] keywords
  keywords - list of words seperated by , or ;`

export default function help(user: User): void {
  user.sendText(`
  ${queryHelp}

  ${tagHelp}

  Library: Get a list of all exisiting tags
  [l or library]
  `)
}
