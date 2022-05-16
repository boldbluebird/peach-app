import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'

import tw from '../styles/tailwind'

import { Button, Headline, Icon, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'

type Props = {
  contractId: Contract['id'],
  navigation: NavigationContainerRefWithCurrent<RootStackParamList>,
}

export default ({ contractId, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ content: null, showCloseButton: true })
  }

  const goToContract = () => {
    navigation.navigate('contractChat', { contractId })
    closeOverlay()
  }

  return <View style={tw`px-6`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('paymentMade.title')}
    </Headline>
    <View style={tw`flex items-center mt-3`}>
      <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
        <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color as string} />
      </View>
    </View>
    <Text style={tw`text-center text-white-1 mt-5`}>
      {i18n('paymentMade.description', contractId)}
    </Text>
    <View style={tw`flex justify-center items-center mt-5`}>
      <Button
        title={i18n('goToMatch')}
        secondary={true}
        wide={false}
        onPress={goToContract}
      />
      <Button
        title={i18n('later')}
        style={tw`mt-2`}
        tertiary={true}
        wide={false}
        onPress={closeOverlay}
      />
    </View>
  </View>
}