import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { SocketEvent } from '@shared/socket'

const sock = new WebSocket('ws://localhost:3000/ws')

sock.onerror = (e) => {
  console.error(e)
}

export function send(event: SocketEvent): void {
  sock.send(event.stringify())
}

/**
 * Wrap app in socket and render only when socket is ready
 */
const Socket: FC = ({ children }) => {
  const dispatch = useDispatch()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    sock.onopen = () => {
      setReady(true)
    }

    sock.onmessage = (e) => {
      const event: SocketEvent = JSON.parse(e.data)
      dispatch(event)
    }
  })

  if (ready) {
    return <div>{children}</div>
  } else {
    return <div>No socket connection</div>
  }
}

export default Socket
