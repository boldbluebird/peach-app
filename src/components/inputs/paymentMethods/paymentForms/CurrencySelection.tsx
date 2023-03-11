import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { getPaymentMethodInfo } from '../../../../utils/paymentMethod'
import { Text } from '../../../text'
import { CurrencyItem } from '../../CurrencyItem'

export const toggleCurrency = (currency: Currency) => (currencies: Currency[]) => {
  if (!currencies.includes(currency)) {
    currencies.push(currency)
  } else {
    currencies = currencies.filter((c) => c !== currency)
  }
  return [...currencies]
}

type CurrencySelectionProps = ComponentProps & {
  paymentMethod: PaymentMethod
  selectedCurrencies: Currency[]
  onToggle: (currencies: Currency) => void
}

export const CurrencySelection = ({
  paymentMethod,
  selectedCurrencies,
  onToggle,
  style,
}: CurrencySelectionProps): ReactElement => {
  const [paymentMethodInfo] = useState(getPaymentMethodInfo(paymentMethod))

  return (
    <View style={style}>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`input-label`}>{i18n('form.additionalCurrencies')}</Text>
      </View>
      <View style={tw`flex-row flex-wrap`}>
        {paymentMethodInfo.currencies.map((currency, i) => (
          <CurrencyItem
            key={currency}
            style={[i > 0 ? tw`ml-2` : {}]}
            label={currency}
            isSelected={selectedCurrencies.includes(currency)}
            onPress={() =>
              !selectedCurrencies.includes(currency) || selectedCurrencies.length > 1 ? onToggle(currency) : null
            }
          />
        ))}
      </View>
    </View>
  )
}
