import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { Icon, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

const translationsPath = 'settings.backups.seedPhrase.'
const items = [
  { id: 'edit', text: 'writeItDown', color: tw`text-success-main`.color },
  { id: 'cameraOff', text: 'noPictures', color: tw`text-error-main`.color },
  { id: 'cloudOff', text: 'noDigital', color: tw`text-error-main`.color },
] as const

export const SecurityInfo = (): ReactElement => (
  <View style={tw`w-full`}>
    <Text style={tw`text-center subtitle-1`}>{i18n(translationsPath + 'toRestore')}</Text>
    <Text style={tw`h6 text-center mt-[45px]`}>{i18n(translationsPath + 'keepSecure')}</Text>
    {items.map(({ id, text, color }) => (
      <View key={id} style={tw`flex-row items-center mt-6`}>
        <Icon id={id} style={tw`w-11 h-11`} color={color} />
        <Text style={tw`flex-1 pl-4 body-m`}>{i18n(translationsPath + text)}</Text>
      </View>
    ))}
  </View>
)
