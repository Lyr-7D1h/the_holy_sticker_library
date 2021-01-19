import { FastifyInstance, FastifyPluginCallback } from "fastify"
import fp from "fastify-plugin"
import fs from "fs"
import path, { join } from "path"
import { create, HostDevice, Whatsapp } from "venom-bot"

interface VenomSetup {
  status: "pending" | "loggedin" | "loggedout"
  device?: HostDevice
  client?: Whatsapp
}

/** Only use property status if not a venom_hook */
interface VenomPlugin extends VenomSetup {
  device: HostDevice
  client: Whatsapp
}

/** Declare VenomPlugin Interface for FastifyInstance */
declare module "fastify" {
  interface FastifyInstance {
    venom: VenomPlugin
  }
}

const venomInfo: VenomSetup = {
  status: "pending",
}

/** Get all information needed */
function getInfo(client: Whatsapp) {
  return Promise.all([client.getHostDevice()])
}

/** Populate venomInfo and call import */
function handleClient(client: Whatsapp, fastify: FastifyInstance) {
  venomInfo.status = "loggedin"

  getInfo(client)
    .then(([device]) => {
      venomInfo.device = device
      venomInfo.client = client

      // Start importing venom hooks
      fastify.import(join(__dirname, "../venom_hooks"))
    })
    .catch((err) => {
      fastify.log.error(err)
    })
}

function writeQR(qrCode: string) {
  qrCode = qrCode.replace("data:image/png;base64,", "")
  const buffer = Buffer.from(qrCode, "base64")

  fs.writeFileSync("./resources/qr.png", buffer)
}

/**
 * Setting up venom library to work with fastify
 */
const venomPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.decorate("venom", venomInfo)

  // close client when fastify closes
  fastify.addHook("onClose", (_, done) => {
    // TODO: tests if works
    if (venomInfo.client) {
      venomInfo.client.close()
    }
    done()
  })

  create(
    "main",
    (base64QR) => {
      writeQR(base64QR)
    },
    (status) => {
      fastify.log.info(`Venom: Status is "${status}"`)
      if (status === "notLogged") {
        venomInfo.status = "loggedout"
      }
    },
    {
      logQR: false,
      autoClose: 0,
      disableWelcome: true,
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
  name: "venom",
  dependencies: ["db", "import"],
})
