/**
 * Sticker
 */

import { SocketEvent } from './socket'
import { Tag } from './tag'

export interface Sticker {
  hash: string
  tags?: Tag[]
}

/**
 * Sticker Events
 */
export interface GetStickersConstructor {
  limit?: number
  noTag?: boolean
  hasTag?: string
  page?: number
}
export interface GetStickersParams extends GetStickersConstructor {
  limit: number
  page: number
}

export class GetStickersRequest extends SocketEvent {
  payload: GetStickersParams
  constructor(payload: GetStickersConstructor) {
    payload.limit = payload.limit
      ? payload.limit > 50
        ? 50
        : payload.limit
      : 50
    payload.page = payload.page ? payload.page : 0
    super('library/getStickers', payload)
  }
}

export interface GetStickersResponseParams {
  stickers: Sticker[]
  page: number
}

export class GetStickersResponse extends SocketEvent {
  payload: GetStickersResponseParams
  constructor(payload: GetStickersResponseParams) {
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
