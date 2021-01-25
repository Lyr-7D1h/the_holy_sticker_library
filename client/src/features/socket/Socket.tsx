import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { SocketEvent, SocketParsingError } from '@shared/socket'

const sock = new WebSocket('ws://localhost:3000/ws')

sock.onerror = (e) => {
  console.error(e)
}

export function send(event: SocketEvent): void {
  sock.send(event.stringify())
}

/**
 * Wrap app in Socket and render only when socket is ready
 */
const Socket: FC = ({ children }) => {
  const dispatch = useDispatch()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    sock.onopen = () => {
      setReady(true)
    }

    sock.onmessage = (e) => {
      let event
      try {
        event = SocketEvent.parse(e.data)
      } catch (e) {
        event = new SocketParsingError('Client: could not parse', e)
      }
      console.debug('Incomming event', event)
      dispatch({ type: event.type, payload: event.payload })
    }
  })

  if (ready) {
    return <div>{children}</div>
  } else {
    return <div>No socket connection</div>
  }
}

export default Socket
