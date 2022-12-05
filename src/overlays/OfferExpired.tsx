import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Headline, PrimaryButton, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { Navigation } from '../utils/navigation'

type Props = {
  offer: SellOffer
  days: string
  navigation: Navigation
}

export default ({ offer, days, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ content: null, showCloseButton: true })
  }

  const goToOffer = () => {
    navigation.navigate('offer', { offer })
    closeOverlay()
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('offerExpired.title')}</Headline>
      <Text style={tw`text-center text-white-1 mt-5`}>{i18n('offerExpired.description', days)}</Text>
      <View style={tw`flex justify-center items-center mt-5`}>
        <PrimaryButton onPress={goToOffer} narrow>
          {i18n('refund')}
        </PrimaryButton>
        <PrimaryButton style={tw`mt-2`} onPress={closeOverlay} narrow>
          {i18n('later')}
        </PrimaryButton>
      </View>
    </View>
  )
}
