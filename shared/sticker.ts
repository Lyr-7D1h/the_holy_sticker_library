/**
 * Sticker
 */

import { SocketEvent } from './socket'

export interface Sticker {
  id: number
  hash: string
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
