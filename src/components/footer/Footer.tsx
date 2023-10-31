import { TouchableOpacity, View } from 'react-native'
import { Icon, Text } from '..'
import PeachBorder from '../../assets/logo/peachBorder.svg'
import PeachOrange from '../../assets/logo/peachOrange.svg'
import { useKeyboard, useNavigation, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { NotificationBubble } from '../bubble/NotificationBubble'
import { useNotificationStore } from './notificationsStore'

const tabs = ['buy', 'sell', 'wallet', 'yourTrades', 'settings'] as const

export const Footer = () => {
  const keyboardOpen = useKeyboard()

  if (keyboardOpen) return <View />

  return (
    <View style={[tw`flex-row items-center self-stretch justify-between py-2 bg-primary-background`, tw.md`pt-4 pb-0`]}>
      {tabs.map((id) => (
        <FooterItem key={`footer-${id}`} id={id} />
      ))}
    </View>
  )
}

function FooterItem ({ id }: { id: (typeof tabs)[number] }) {
  const currentPage = useRoute().name
  const navigation = useNavigation()
  const onPress = () => {
    navigation.reset({ index: 0, routes: [{ name: id }] })
  }

  const active = currentPage === id
  const color = active ? (id === 'settings' ? tw`text-primary-main` : tw`text-black-1`) : tw`text-black-2`
  const size = tw`w-6 h-6`
  const notifications = useNotificationStore((state) => state.notifications)
  return (
    <TouchableOpacity onPress={onPress} style={tw`items-center flex-1 gap-2px`}>
      <View style={size}>
        {id === 'settings' ? (
          active ? (
            <PeachOrange style={size} />
          ) : (
            <PeachBorder style={size} />
          )
        ) : (
          <Icon id={id} style={size} color={color.color} />
        )}
        {id === 'yourTrades' ? (
          <NotificationBubble notifications={notifications} style={tw`absolute -right-2 -top-2`} />
        ) : null}
      </View>
      <Text style={[color, tw`leading-relaxed text-center subtitle-1 text-9px`]}>{i18n(`footer.${id}`)}</Text>
    </TouchableOpacity>
  )
}
