import { SocketEvent } from './socket'

export interface Sticker {
  id: number
  hash: string
}

/**
 * Socket Events
 */

export class GetStickersRequest extends SocketEvent {
  payload = { limit: 50 }
  constructor(payload: { limit: number }) {
    super('library/getStickers', payload)
  }
}

export class GetStickersResponse extends SocketEvent {
  payload: Sticker[]
  constructor(payload: Sticker[]) {
    super('library/stickers', payload)
  }
}
