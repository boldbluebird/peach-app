import { EffectCallback } from 'react'
import { AppState } from 'react-native'

let appState = 'active'
let statChangeTime = new Date().getTime()

type AppStateEffectProps = {
  callback: (active: boolean, delta: number) => void
}

export default ({ callback }: AppStateEffectProps): EffectCallback => () => {
  const subscription = AppState.addEventListener('change', nextAppState => {
    const now = new Date().getTime()
    if (appState.match(/inactive|background/u) && nextAppState === 'active'
    ) {
      callback(true, now - statChangeTime)
      statChangeTime = now
    } else if (appState === 'active' && nextAppState.match(/inactive|background/u)) {
      callback(false, now - statChangeTime)
      statChangeTime = now
    }

    appState = nextAppState
  })

  return () => {
    subscription.remove()
  }
}