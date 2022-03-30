import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Text } from '../../components'
import i18n from '../../utils/i18n'


export default (): ReactElement => {
  useContext(LanguageContext)

  return <View>
    <Text style={[tw`font-baloo text-center text-3xl leading-3xl text-peach-1`, tw.md`text-5xl`]}>
      {i18n('welcome.letsGetStarted.title')}
    </Text>
    <Text style={tw`mt-4 text-center`}>
      {i18n('welcome.letsGetStarted.description.1')}
    </Text>
  </View>
}