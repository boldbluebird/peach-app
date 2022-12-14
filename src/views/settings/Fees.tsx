import React, { ReactElement, useContext, useMemo } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, Text, Title } from '../../components'
import { PEACHFEE } from '../../constants'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { useHeaderSetup } from '../../hooks'

export default (): ReactElement => {
  useContext(LanguageContext)
  useHeaderSetup(useMemo(() => ({ title: i18n('settings.peachFees') }), []))

  type BulletPointProps = { text: String }

  const BulletPoint = ({ text }: BulletPointProps) => (
    <View style={tw`flex-row`}>
      <Text style={tw`body-m`}> · </Text>
      <Text style={tw`body-m`}>{text}</Text>
    </View>
  )

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-1 items-start justify-center p-6`}>
        <Text style={tw`body-m`}>
          {i18n('settings.fees.text.1')}
          <Text style={tw`body-m text-primary-main`}> {(PEACHFEE * 100).toString()}% </Text>
          {i18n('settings.fees.text.2')}
          {'\n'}
        </Text>
        <Text style={tw`body-m`}>
          {i18n('settings.fees.text.3')}
          {'\n'}
        </Text>
        <BulletPoint text={i18n('settings.fees.point.1')} />
        <BulletPoint text={i18n('settings.fees.point.2')} />
        <BulletPoint text={i18n('settings.fees.point.3')} />
      </View>
      <GoBackButton style={tw`m-10 self-center`} />
    </View>
  )
}
