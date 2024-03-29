import { execSync } from 'child_process'
import { FastifyInstance, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import fs from 'fs'
import { join } from 'path'
import { create, HostDevice, Whatsapp } from 'venom-bot'

interface VenomSetup {
  status: 'pending' | 'loggedin' | 'loggedout'
  device?: HostDevice
  client?: Whatsapp
}

/** Only use property status if not a venom_hook */
interface VenomPlugin extends VenomSetup {
  device: HostDevice
  client: Whatsapp
}

/** Declare VenomPlugin Interface for FastifyInstance */
declare module 'fastify' {
  interface FastifyInstance {
    venom: VenomPlugin
  }
}

const venomInfo: VenomSetup = {
  status: 'pending',
}

/** Get all information needed */
function getInfo(client: Whatsapp) {
  return Promise.all([client.getHostDevice()])
}

/** Populate venomInfo and call import */
function handleClient(client: Whatsapp, fastify: FastifyInstance) {
  venomInfo.status = 'loggedin'

  getInfo(client)
    .then(([device]) => {
      venomInfo.device = device
      venomInfo.client = client

      // Start importing venom hooks
      import(join(__dirname, '../whatsapp'))
        .then((i) => new i.default(fastify))
        .catch((err) => fastify.log.error(err))
    })
    .catch((err) => {
      fastify.log.error(err)
    })
}

function writeQR(qrCode: string) {
  qrCode = qrCode.replace('data:image/png;base64,', '')
  const buffer = Buffer.from(qrCode, 'base64')

  fs.writeFileSync(join(__dirname, '../../../resources/qr.png'), buffer)
}

function getChromiumPath() {
  return execSync('readlink $(which chromium-browser)').toString()
}

/**
 * Setting up venom library to work with fastify
 */
const venomPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.decorate('venom', venomInfo)

  // close client when fastify closes
  fastify.addHook('onClose', (_, done) => {
    if (venomInfo.client) {
      venomInfo.client.close()
    }
    done()
  })

  create(
    'hsl',
    (base64QR) => {
      writeQR(base64QR)
    },
    (status) => {
      fastify.log.info(`Venom: Status is "${status}"`)
      if (status === 'notLogged') {
        venomInfo.status = 'loggedout'
      }
    },
    {
      logQR: false,
      disableWelcome: true,
      autoClose: 0,

      browserArgs: ['--disable-dev-shm-usage'],
      useChrome: process.env.NODE_ENV !== 'production',
      puppeteerOptions:
        process.env.NODE_ENV === 'production'
          ? { executablePath: getChromiumPath() }
          : undefined,
    }
  )
    .then((client) => handleClient(client, fastify))
    .catch((err) => {
      fastify.log.error(err)
      throw err
    })

  done()
}

export default fp(venomPlugin, {
  name: 'venom',
  dependencies: ['db'],
})
