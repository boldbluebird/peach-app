import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback, useContext } from 'react'
import { AppState } from 'react-native'
import { MessageContext } from '../../contexts/message'
import { info } from '../../utils/log'
import { useOfferPopupEvents } from './eventHandler/offer/useOfferPopupEvents'
import { useOverlayEvents } from './eventHandler/useOverlayEvents'
import { useStateUpdateEvents } from './eventHandler/useStateUpdateEvents'
import { useGetPNActionHandler } from './useGetPNActionHandler'

export const useMessageHandler = (currentPage: keyof RootStackParamList | undefined) => {
  const [, updateMessage] = useContext(MessageContext)
  const getPNActionHandler = useGetPNActionHandler()
  const overlayEvents = useOverlayEvents()
  const offerPopupEvents = useOfferPopupEvents()
  const stateUpdateEvents = useStateUpdateEvents()

  const onMessageHandler = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> => {
      info(`A new FCM message arrived! ${JSON.stringify(remoteMessage)}`, `currentPage ${currentPage}`)
      if (!remoteMessage.data) return

      const data = remoteMessage.data as unknown as PNData
      const { type } = data
      if (!type) return

      if (overlayEvents[type]) {
        overlayEvents[type]?.(data)
      } else if (offerPopupEvents[type]) {
        offerPopupEvents[type]?.(data, remoteMessage.notification)
      } else if (stateUpdateEvents[type]) {
        stateUpdateEvents[type]?.(data)
      } else if (AppState.currentState === 'active') {
        updateMessage({
          msgKey: `notification.${type}`,
          bodyArgs: remoteMessage.notification?.bodyLocArgs,
          level: 'WARN',
          action: getPNActionHandler(data),
        })
      }
    },
    [currentPage, getPNActionHandler, offerPopupEvents, overlayEvents, stateUpdateEvents, updateMessage],
  )
  return onMessageHandler
}
