import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, PrimaryButton, Text } from '../../components'
import { HelpIcon } from '../../components/icons'
import { BitcoinAddressInput } from '../../components/inputs'
import { OverlayContext } from '../../contexts/overlay'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../hooks'
import { account, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { RefundAddressPopup } from './components/RefundAddressPopup'

const rulesToCheck = { required: false, bitcoinAddress: true }
export default (): ReactElement => {
  const [address, setAddress, isValid, addressErrors] = useValidatedState(
    account.settings.returnAddress || '',
    rulesToCheck,
  )
  const [isUpdated, setUpdated] = useState(!!account.settings.returnAddress)
  const navigation = useNavigation()

  const setReturnAddress = () => {
    if (isValid) {
      updateSettings({ returnAddress: address }, true)
      setUpdated(true)
    }
  }
  const [, updateOverlay] = useContext(OverlayContext)
  const showRefundAddressPopup = useCallback(() => {
    updateOverlay({
      content: <RefundAddressPopup />,
      level: 'INFO',
      visible: true,
      title: i18n('settings.refundAddress'),
      action2: {
        callback: () => {
          updateOverlay({ visible: false })
          navigation.navigate('contact')
        },
        label: 'help',
        icon: 'alertCircle',
      },
      action1: {
        callback: () => updateOverlay({ visible: false }),
        label: 'close',
        icon: 'xSquare',
      },
    })
  }, [navigation, updateOverlay])

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.refundAddress'),
        icons: [{ iconComponent: <HelpIcon />, onPress: showRefundAddressPopup }],
      }),
      [showRefundAddressPopup],
    ),
  )

  const onChange = useCallback(
    (value: string) => {
      setAddress((prev) => {
        if (prev !== value) {
          setUpdated(false)
        }
        return value
      })
    },
    [setAddress],
  )

  return (
    <View style={tw`items-center justify-center w-full h-full`}>
      <Text style={tw`h6`}>{i18n('settings.refundAddress.title')}</Text>
      <View style={tw`mx-16 mt-4`}>
        <BitcoinAddressInput
          {...{
            onChange,
            value: address,
            errorMessage: addressErrors,
          }}
        />
      </View>
      {isUpdated && (
        <View style={tw`flex-row justify-center w-full h-0`}>
          <Text style={tw`h-6 uppercase button-medium`}>{i18n('settings.refundAddress.success')}</Text>
          <Icon id="check" style={tw`w-5 h-5 ml-1`} color={tw`text-success-main`.color} />
        </View>
      )}
      <PrimaryButton narrow style={tw`absolute mt-16 bottom-6`} onPress={setReturnAddress} disabled={isUpdated}>
        {i18n('settings.refundAddress.confirm')}
      </PrimaryButton>
    </View>
  )
}
