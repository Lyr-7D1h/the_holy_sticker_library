/**
 * Sticker
 */

import { SocketEvent } from './socket'
import { Tag } from './tag'

export interface Sticker {
  hash: string
  tags?: Tag[]
}

export interface GetStickersConstructor {
  limit?: number
}
export interface GetStickersParams extends GetStickersConstructor {
  limit: number
}

/**
 * Sticker Events
 */

export class GetStickersRequest extends SocketEvent {
  payload: GetStickersConstructor
  constructor(payload: GetStickersConstructor) {
    payload.limit = payload.limit
      ? payload.limit > 50
        ? 50
        : payload.limit
      : 50
    super('library/getStickers', payload)
  }
}

export class GetStickersResponse extends SocketEvent {
  constructor(payload: Sticker[]) {
    super('library/updateStickers', payload)
  }
}

export class RemoveStickerRequest extends SocketEvent {
  static type = 'library/removeStickerRequest'
  payload: Sticker
  constructor(sticker: Sticker) {
    super(RemoveStickerRequest.type, sticker)
  }
}

export class RemoveStickerResponse extends SocketEvent {
  static type = 'library/removeStickerResponse'
  payload: string
  constructor(hash: string) {
    super(RemoveStickerResponse.type, hash)
  }
}
