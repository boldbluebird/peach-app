import React, { ReactElement, useContext, useEffect } from 'react'
import { Pressable, View } from 'react-native'

import { Shadow, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { footerShadow } from '../../utils/layout'
import Icon from '../Icon'
import AppContext from '../../contexts/app'
import { account } from '../../utils/account'
import { getChatNotifications } from '../../utils/chat'
import { getContract as getContractFromDevice, saveContract } from '../../utils/contract'
import { getRequiredActionCount } from '../../utils/offer'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { IconType } from '../icons'
import { Bubble } from '../ui'
import { Navigation } from '../../utils/navigation'
import { useKeyboard } from '../../hooks'

type FooterProps = ComponentProps & {
  active: keyof RootStackParamList
  setCurrentPage: React.Dispatch<React.SetStateAction<keyof RootStackParamList>>
  navigation: Navigation
}
type FooterItemProps = ComponentProps & {
  id: IconType
  active: boolean
  onPress: () => void
  notifications?: number
}

// eslint-disable-next-line max-len
const isSettings
  = /settings|contact|report|language|currency|backups|paymentMethods|deleteAccount|fees|socials|seedWords/u

/**
 * @description Component to display the Footer Item
 * @param props Component properties
 * @param props.id item id
 * @param props.active active menu item
 * @param props.onPress on press handler
 * @example
 * <FooterItem id="sell" active={true} />
 */
const FooterItem = ({ id, active, onPress, notifications = 0, style }: FooterItemProps): ReactElement => {
  const color = active ? tw`text-black-1` : tw`text-black-3`
  return (
    <Pressable testID={`footer-${id}`} onPress={onPress} style={[style, tw`flex-row justify-center`]}>
      <View>
        <View style={[tw`flex items-center`, !active ? tw`opacity-30` : {}]}>
          <Icon id={id} style={tw`w-7 h-7 mt-1`} color={color.color} />
          <Text style={[color, tw`text-3xs text-center`]}>{i18n(id)}</Text>
        </View>
        {notifications ? (
          <View style={tw`absolute top-0 left-1/2 -mt-1 ml-2 `}>
            <Bubble color={tw`text-success-light`.color} style={tw`flex justify-center items-center`}>
              <Text
                style={tw`text-xs font-baloo text-primary-background text-center p-0.7`}
                ellipsizeMode="head"
                numberOfLines={1}
              >
                {notifications}
              </Text>
            </Bubble>
          </View>
        ) : null}
      </View>
    </Pressable>
  )
}

/**
 * @description Component to display the Footer
 * @param props Component properties
 * @param props.active active menu item
 * @example
 * <Footer active={'home'} />
 */
export const Footer = ({ active, style, setCurrentPage, navigation }: FooterProps): ReactElement => {
  const [{ notifications }, updateAppContext] = useContext(AppContext)
  const ws = useContext(PeachWSContext)

  const keyboardOpen = useKeyboard()

  const navTo = (page: keyof RootStackParamList) => {
    setCurrentPage(page)
    navigation.navigate(page as string, {})
  }
  const navigate = {
    home: () => navTo('home'),
    buy: () => navTo('buy'),
    sell: () => navTo('sell'),
    yourTrades: () => navTo('yourTrades'),
    settings: () => navTo('settings'),
  }

  useEffect(() => {
    updateAppContext({
      notifications: getChatNotifications() + getRequiredActionCount(),
    })
  }, [])

  useEffect(() => {
    const contractUpdateHandler = async (update: ContractUpdate) => {
      const contract = getContractFromDevice(update.contractId)

      if (!contract) return
      saveContract({
        ...contract,
        [update.event]: new Date(update.data.date),
      })
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount(),
      })
    }
    const messageHandler = async (message: Message) => {
      if (!message.message || !message.roomId || message.from === account.publicKey) return
      const contract = getContractFromDevice(message.roomId.replace('contract-', ''))
      if (!contract) return

      saveContract({
        ...contract,
        unreadMessages: contract.unreadMessages + 1,
      })
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount(),
      })
    }
    const unsubscribe = () => {
      ws.off('message', contractUpdateHandler)
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', contractUpdateHandler)
    ws.on('message', messageHandler)

    return unsubscribe
  }, [ws.connected])

  return !keyboardOpen ? (
    <View style={[tw`w-full flex-row items-start`, style]}>
      <View style={tw`flex-grow relative`}>
        <Shadow shadow={footerShadow} style={tw`w-full`}>
          <View style={tw`flex-row items-center justify-between bg-primary-background`}>
            <FooterItem
              id="buy"
              style={tw`w-1/4`}
              active={active === 'buy' || active === 'home'}
              onPress={navigate.buy}
            />
            <FooterItem id="sell" style={tw`w-1/4`} active={active === 'sell'} onPress={navigate.sell} />
            <FooterItem
              id="list"
              style={tw`w-1/4`}
              active={active === 'yourTrades' || /contract/u.test(active as string)}
              onPress={navigate.yourTrades}
              notifications={notifications}
            />
            <FooterItem
              id="settings"
              style={tw`w-1/4`}
              active={isSettings.test(active as string)}
              onPress={navigate.settings}
            />
          </View>
        </Shadow>
      </View>
    </View>
  ) : (
    <View />
  )
}

export default Footer
