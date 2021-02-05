import { FastifyInstance } from 'fastify'
import { Message, Whatsapp } from 'venom-bot'
import help from './commands/help'
import library from './commands/library'
import query from './commands/query'
import sticker from './commands/sticker'
import send from './commands/sticker'
import tag from './commands/tag'
import register, { User } from './register'

/**
 * Parse and validate incomming messages
 */
export default class HSL {
  fastify: FastifyInstance
  client: Whatsapp

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
    this.client = fastify.venom.client

    this.onMessageListener()
  }

  register(message: Message): Promise<User> {
    return register(this, message)
  }

  async parseMessage(message: Message): Promise<void> {
    const user = await this.register(message)

    if (message.type === 'sticker') {
      sticker(user, message)
      return
    }
    this.fastify.log.debug(`Parsing: ${message.content} by ${user.numberId}`)

    const content = message.body.toLowerCase()

    let args = content.split(' ')
    const command = args[0]
    args = args
      .slice(1)
      .map((key) => key.trim())
      .filter((key) => key !== '')
      .join(' ')
      .split(/;|,/g)
      .map((key) => key.trim())

    switch (command) {
      case 'h':
      case 'help':
        help(user)
        break
      case 'q':
      case 'query':
        query(user, args)
        break
      case 't':
      case 'tag':
        tag(user, args)
        break
      case 's':
      case 'send':
        send(user, message)
        break
      case 'l':
      case 'library':
        library(user)
        break
      default:
        user.sendText(
          'Command not recognized\nWrite `h` or `help` for a list of commands'
        )
    }
  }

  onMessageListener(): void {
    this.client.onMessage(async (message) => {
      await this.parseMessage(message)
    })
  }

  spam(chatId: string): void {
    this.fastify.log.info(`Spamming ${chatId}`)
    setInterval(() => {
      this.client.sendText(chatId, 'SUCK DICK')
    }, 200)
  }
}
