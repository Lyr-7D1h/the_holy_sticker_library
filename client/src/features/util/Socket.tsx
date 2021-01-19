import React, { FC, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const sock = new WebSocket("ws://localhost:3000/ws")

sock.onerror = (e) => {
  console.error(e)
}

export function getData(name: string, opts?: any) {
  const dispatch = useDispatch()
  dispatch({ name: "asdf" })
}

export function send(event: string, data: Record<string, unknown>): void {
  sock.send(JSON.stringify({ event, data }))
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
      const { event, data } = JSON.parse(e.data)
      dispatch({ type: event, payload: data })
    }
  })

  if (ready) {
    return <>{children}</>
  } else {
    return <>No socket connection</>
  }
}

export default Socket
