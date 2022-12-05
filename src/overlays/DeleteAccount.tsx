import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Headline, Icon, PrimaryButton } from '../components'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import { deleteAccount } from '../utils/account'
import i18n from '../utils/i18n'

const AccountDeleted = (): ReactElement => (
  <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
      {i18n('settings.deleteAccount.deleted.title')}
    </Headline>
    <Icon id="fire" style={tw`w-12 h-12 mt-5`} color={tw`text-white-1`.color} />
  </View>
)

type DeleteAccountProps = {
  navigate: () => void
}

export const DeleteAccount = ({ navigate }: DeleteAccountProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const ok = async () => {
    await deleteAccount({ onSuccess: navigate })
    updateOverlay({ content: <AccountDeleted />, showCloseButton: false })
    setTimeout(() => {
      closeOverlay()
    }, 3000)
  }
  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('settings.deleteAccount.title')}
      </Headline>
      <PrimaryButton style={tw`mt-2`} onPress={closeOverlay} narrow>
        {i18n('settings.deleteAccount.back')}
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={ok} narrow>
        {i18n('settings.deleteAccount.ok')}
      </PrimaryButton>
    </View>
  )
}
