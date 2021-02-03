import { FastifyInstance } from 'fastify'
import { Message, Whatsapp } from 'venom-bot'
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

    this.fastify.log.debug(`Parsing: ${message.content} by ${user.numberId}`)

    const content = message.body.toLowerCase()

    let args = content.split(' ')
    const command = args[0]
    args = args
      .slice(1)
      .map((key) => key.trim())
      .filter((key) => key !== '')

    switch (command) {
      case 'q':
        if (args.length == 0) {
          this.client.sendText(message.chat.contact.id, 'No keywords given')
          break
        }

        //   query(fastify, args);
        break
      case 't' || 'tag':
        tag(this.fastify, args)
        break
      case 's':
        //   send(fastify, args);
        break
      case 'l':
        break
      default:
        this.client.sendText(message.from, 'Command not recognized')
    }
  }

  onMessageListener(): void {
    this.client.onMessage(async (message) => {
      await this.parseMessage(message)
    })
  }
}
