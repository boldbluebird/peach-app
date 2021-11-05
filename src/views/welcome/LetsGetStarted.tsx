import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Text } from '../../components'
import i18n from '../../utils/i18n'
import { StackNavigationProp } from '@react-navigation/stack'


export default (): ReactElement => {
  useContext(LanguageContext)

  return <View>
    <Text style={[tw`font-baloo text-center text-3xl leading-3xl text-peach-1`, tw.md`text-5xl`]}>
      {i18n('welcome.letsGetStarted.title')}
    </Text>

  </View>
}