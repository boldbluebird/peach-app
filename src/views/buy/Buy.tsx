import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { Headline, Hint, PrimaryButton, Title } from '../../components'
import { RangeAmount } from '../../components/inputs/RangeAmount'
import { MAXTRADINGAMOUNT, MINTRADINGAMOUNT } from '../../constants'
import { useNavigation, useValidatedState } from '../../hooks'
import { account, updateSettings } from '../../utils/account'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useBuySetup } from './hooks/useBuySetup'

const rangeRules = { min: MINTRADINGAMOUNT, max: MAXTRADINGAMOUNT, required: true }

export default (): ReactElement => {
  const navigation = useNavigation()
  useBuySetup()

  const [minAmount, setMinAmount, minAmountValid] = useValidatedState(account.settings.minAmount, rangeRules)
  const [maxAmount, setMaxAmount, maxAmountValid] = useValidatedState(account.settings.maxAmount, rangeRules)
  const setSelectedRange = ([min, max]: [number, number]) => {
    setMinAmount(min)
    setMaxAmount(max)
  }
  const [showBackupReminder, setShowBackupReminder] = useState(account.settings.showBackupReminder !== false)

  useEffect(() => {
    updateSettings({ minAmount, maxAmount }, true)
  }, [minAmount, maxAmount])

  const goToBackups = () => navigation.navigate('backups')
  const dismissBackupReminder = () => {
    updateSettings({ showBackupReminder: false }, true)
    setShowBackupReminder(false)
  }

  const next = () => {
    navigation.navigate('buyPreferences', { amount: [Number(minAmount), Number(maxAmount)] })
  }

  return (
    <View testID="view-buy" style={tw`flex h-full`}>
      <View style={tw`z-20 flex-shrink h-full`}>
        <View style={tw`flex h-full pb-8 pt-7`}>
          <Title title={i18n('buy.title')} />
          <View style={tw`z-10 flex justify-center flex-shrink h-full`}>
            <View>
              <Headline style={tw`px-5 mt-16 text-grey-1`}>{i18n('buy.subtitle')}</Headline>
              <View style={tw`absolute z-10 flex-row items-start justify-center w-full px-6 mt-3`}></View>
              <RangeAmount
                {...{
                  min: MINTRADINGAMOUNT,
                  max: MAXTRADINGAMOUNT,
                  value: [minAmount, maxAmount],
                  onChange: setSelectedRange,
                }}
              />
            </View>
          </View>
          {showBackupReminder && (
            <Hint
              style={tw`self-center max-w-xs mt-2`}
              title={i18n('hint.backup.title')}
              text={i18n('hint.backup.text')}
              icon="lock"
              onPress={goToBackups}
              onDismiss={dismissBackupReminder}
            />
          )}
        </View>
      </View>
      <PrimaryButton
        disabled={!minAmountValid || !maxAmountValid}
        testID="navigation-next"
        style={tw`self-center mx-6 mt-4 mb-10 bg-white-1`}
        onPress={next}
        narrow
      >
        {i18n('next')}
      </PrimaryButton>
      <DailyTradingLimit />
    </View>
  )
}
