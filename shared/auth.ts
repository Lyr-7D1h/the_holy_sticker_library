import { SocketEvent } from './socket'

export interface AuthenticateRequestParams {
  username: string
  password: string
}

export class AuthenticateRequest extends SocketEvent {
  static type = 'auth/request'
  payload: AuthenticateRequestParams
  constructor(payload: AuthenticateRequestParams) {
    super(AuthenticateRequest.type, payload)
  }
}
export class AuthenticateResponse extends SocketEvent {
  static type = 'auth/response'
  payload: boolean
  constructor(loggedIn: boolean) {
    super(AuthenticateResponse.type, loggedIn)
  }
}
