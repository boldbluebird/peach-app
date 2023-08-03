import { createContext, ReducerState, useContext } from 'react'

export let ws: WebSocket
export let peachWS: PeachWS = {
  authenticated: false,
  connected: false,
  queue: [],
  listeners: {
    message: [],
    close: [],
  },
  send: () => true,
  on: (listener: 'message' | 'close', callback: WSCallback) => {
    peachWS.listeners[listener].push(callback)
    peachWS.listeners[listener] = peachWS.listeners[listener].filter(
      (cllbck, index, self) => self.findIndex((c) => c.toString() === cllbck.toString()) === index,
    )
  },
  off: (listener: 'message' | 'close', callback: WSCallback) => {
    peachWS.listeners[listener] = peachWS.listeners[listener].filter(
      (cllbck) => cllbck.toString() !== callback.toString(),
    ) as WSCallback[]
  },
  close: () => {},
}
export const getWebSocket = () => peachWS

export const PeachWSContext = createContext(peachWS)
export const useWebsocketContext = () => useContext(PeachWSContext)

export const setWS = (_ws: WebSocket) => (ws = _ws)
export const setPeachWS = (state: ReducerState<any>, newPeachWS: PeachWS): PeachWS => {
  peachWS = newPeachWS

  return peachWS
}
