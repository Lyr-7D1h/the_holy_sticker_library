/** Base class socket event */
export class SocketEvent {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any

  constructor(type: string, payload = {}) {
    this.type = type
    this.payload = payload
  }

  // FIXME: add validation
  static parse(data: string): SocketEvent {
    const { type, payload } = JSON.parse(data)
    return new SocketEvent(type, payload)
  }

  stringify(): string {
    return JSON.stringify({
      type: this.type,
      payload: this.payload,
    })
  }
}

export class SocketError extends SocketEvent {
  constructor(description = 'Something went wrong', error?: Error | string) {
    let errorMessage = ''
    if (error instanceof Error) {
      if ('message' in error) {
        errorMessage = error.message
      }
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    console.log(description, errorMessage)
    if (errorMessage) {
      super('socket/error', { message: `${description}: ${errorMessage}` })
    } else {
      super('socket/error', { message: description })
    }
    console.log(this.payload)
  }
}

export class SocketParsingError extends SocketError {
  constructor(description: string, error?: Error | string) {
    super(description, error)
    this.type = 'socket/parsingError'
  }
}

export class SocketNotFound extends SocketError {
  constructor() {
    super('socket/notFound')
  }
}
