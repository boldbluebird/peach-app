import { Dispatch } from 'react'
import { TextInput, View } from 'react-native'

import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import { enforceDecimalsFormat } from '../../../../utils/format'
import i18n from '../../../../utils/i18n'

type Props = {
  customFeeRate?: string
  setCustomFeeRate: Dispatch<string>
  disabled?: boolean
}

export const CustomFeeItem = ({ customFeeRate, setCustomFeeRate, disabled }: Props) => (
  <View style={tw`flex-row items-center gap-2`}>
    <Text style={tw`subtitle-1 leading-base`}>{i18n('settings.networkFees.custom')}:</Text>
    <View
      style={[
        tw`flex-row items-center w-16 h-8 py-3 overflow-hidden rounded-xl`,
        tw`border bg-primary-background-light border-black-2`,
      ]}
    >
      <TextInput
        value={customFeeRate}
        onChangeText={(text) => setCustomFeeRate(enforceDecimalsFormat(text, 2))}
        style={tw`h-8 py-0 text-center grow input-text text-black-1`}
        keyboardType={'decimal-pad'}
        editable={!disabled}
        testID="input-custom-fees"
      />
    </View>
    <Text style={tw`text-black-2`}>{i18n('satsPerByte')}</Text>
  </View>
)
