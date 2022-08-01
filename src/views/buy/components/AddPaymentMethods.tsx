import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Button, Icon, Text } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import CurrencySelect from '../../../overlays/CurrencySelect'
import PaymentMethodSelect from '../../../overlays/PaymentMethodSelect'
import { session } from '../../../utils/session'
import tw from '../../../styles/tailwind'
import { dataToMeansOfPayment, getCurrencies, getPaymentMethods } from '../../../utils/paymentMethod'
import i18n from '../../../utils/i18n'
import {
  account,
  addPaymentData,
  getPaymentData,
  getPaymentDataByType,
  getSelectedPaymentDataIds,
  saveAccount
} from '../../../utils/account'


const initPaymentData = (meansOfPayment: MeansOfPayment) => {
  const paymentMethods = getPaymentMethods(meansOfPayment)
  const currencies = getCurrencies(meansOfPayment)

  return paymentMethods.map(type => {
    const existingPaymentMethodsOfType = getPaymentDataByType(type).length + 1
    const label = i18n(`paymentMethod.${type}`) + ' #' + existingPaymentMethodsOfType
    const selectedCurrencies = currencies.filter(currency => meansOfPayment[currency]?.indexOf(type) !== -1)

    return {
      id: `${type}-${new Date().getTime()}`,
      label,
      type,
      currencies: selectedCurrencies
    }
  })
}

type AddPaymentMethodProps = ComponentProps & {
  setMeansOfPayment: React.Dispatch<React.SetStateAction<Offer['meansOfPayment']>>
  view: 'buyer' | 'seller'
}

export default ({ style, setMeansOfPayment, view }: AddPaymentMethodProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const update = () => {
    setMeansOfPayment(getSelectedPaymentDataIds().map(getPaymentData)
      .filter(data => data)
      .reduce((mop, data) => dataToMeansOfPayment(mop, data!), {}))
  }

  const onPaymentMethodSelect = async (meansOfPayment: MeansOfPayment) => {
    const paymentData = initPaymentData(meansOfPayment)
    for (const newData of paymentData) {
      await addPaymentData(newData as PaymentData, false) // eslint-disable-line no-await-in-loop
    }
    await saveAccount(account, session.password!)
    update()
  }
  const onCurrencySelect = (currencies: Currency[]) => updateOverlay({
    content: <PaymentMethodSelect currencies={currencies} onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const openCurrencySelect = () => updateOverlay({
    content: <CurrencySelect onConfirm={onCurrencySelect} view={view} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const addPaymentMethods = () => {
    openCurrencySelect()
  }

  return <View style={style}>
    <View style={tw`flex items-center`}>
      <Pressable testID="buy-add-mop" onPress={addPaymentMethods} style={tw`flex flex-row items-center`}>
        <Icon id="plus" style={tw`w-7 h-7 mr-2`} color={tw`text-peach-1`.color as string} />
        <Text style={tw`text-peach-1 font-baloo text-sm`}>{i18n('paymentMethod.select.title')}</Text>
      </Pressable>
    </View>
  </View>
}