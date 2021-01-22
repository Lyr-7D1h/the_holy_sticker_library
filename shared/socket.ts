import { Sticker } from './types/library'

export class SocketEvent {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any

  constructor(type: string, payload = {}) {
    this.type = type
    this.payload = payload
  }

  // TODO: add validation
  static parse(data: string): SocketEvent {
    const { type } = JSON.parse(data)
    return new SocketEvent(type)
  }

  stringify(): string {
    return JSON.stringify({
      type: this.type,
      payload: this.payload,
    })
  }
}

export class GetStickersEvent extends SocketEvent {
  payload = { limit: 50 }
  constructor(payload: { limit: number }) {
    super('library/getStickers', payload)
    // this.payload = payload
  }
}

export class StickersEvent extends SocketEvent {
  payload: Sticker[] = []
  constructor(payload: Sticker[]) {
    super('library/stickers', payload)
  }
}

export class SocketErrorEvent extends SocketEvent {
  constructor(error: Error | string) {
    if (error instanceof Error) {
      if ('message' in error) {
        error = error.message
      } else {
        error = 'Something went wrong'
      }
    }
    super('socket/error', { message: error })
  }
}

export class SocketParsingError extends SocketErrorEvent {
  constructor(error: Error | string) {
    if (error instanceof Error && !('message' in error)) {
      error = 'Could not parse'
    }
    super(error)
    // overwrite type
    this.type = 'socket/parsingError'
  }
}

export class SocketNotFoundEvent extends SocketErrorEvent {
  constructor() {
    super('socket/notFound')
  }
}
