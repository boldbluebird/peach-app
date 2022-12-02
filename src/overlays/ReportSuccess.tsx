import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Headline, Icon, PrimaryButton, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { StackNavigation } from '../utils/navigation'
import { account } from '../utils/account'

type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ content: null, showCloseButton: true })
  }

  const goToHome = () => {
    navigation.replace(account?.publicKey ? 'home' : 'welcome', {})
    closeOverlay()
  }
  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('report.success.title')}</Headline>
      <View style={tw`flex items-center mt-3`}>
        <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
          <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
        </View>
      </View>
      <Text style={tw`text-center text-white-1 mt-5`}>{i18n('report.success.text.1')}</Text>
      <Text style={tw`text-center text-white-1 mt-5`}>{i18n('report.success.text.2')}</Text>
      <PrimaryButton style={tw`flex justify-center items-center mt-5`} onPress={goToHome}>
        {i18n('report.success.backHome')}
      </PrimaryButton>
    </View>
  )
}
