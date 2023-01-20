import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import { Input, PremiumSlider, Text } from '../../components'
import { useMarketPrices } from '../../hooks'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { getOfferPrice } from '../../utils/offer'
import { priceFormat } from '../../utils/string'
import { useSellSetup } from './hooks/useSellSetup'
import { SellViewProps } from './SellPreferences'

const validate = (offer: SellOffer) => offer.premium >= -21 && offer.premium <= 21

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useSellSetup({ help: 'premium' })
  const [premium, setPremium] = useState(offer.premium.toString())
  const { data: marketPrice } = useMarketPrices()
  const { displayCurrency } = account.settings
  const currentPrice = marketPrice ? getOfferPrice({ ...offer, prices: marketPrice }, displayCurrency) : 0

  const updatePremium = (value: string | number) => {
    if (!value) return setPremium('')
    const number = Number(value)
    if (isNaN(number)) return setPremium(String(value) || '')
    if (number < -21) return setPremium('-21')
    if (number > 21) return setPremium('21')
    return setPremium(String(value))
  }

  useEffect(() => {
    setPremium(premium)
    updateOffer({
      ...offer,
      premium: Number(premium),
    })
  }, [premium, setPremium, setStepValid, updateOffer])

  useEffect(() => setStepValid(validate(offer)), [offer, setStepValid])

  return (
    <View>
      <Text style={tw`text-center h5`}>{i18n('sell.premium.title')}</Text>
      <View style={tw`flex-row items-center justify-center mt-8`}>
        <Text
          style={[
            tw`leading-2xl`,
            premium === '0' ? {} : offer.premium > 0 ? tw`text-success-main` : tw`text-primary-main`,
          ]}
        >
          {i18n(offer.premium > 0 ? 'sell.premium' : 'sell.discount')}:
        </Text>
        <View style={tw`h-10 ml-2`}>
          <Input
            style={tw`w-16`}
            inputStyle={tw`text-center`}
            value={premium.toString() || '0'}
            onChange={updatePremium}
            keyboardType={'numeric'}
          />
        </View>
      </View>
      {!!currentPrice && (
        <Text style={tw`mt-1 text-center text-black-2`}>
          ({i18n('sell.premium.currently', i18n(`currency.format.${displayCurrency}`, priceFormat(currentPrice)))})
        </Text>
      )}
      <PremiumSlider style={tw`mt-6`} value={Number(premium)} onChange={updatePremium} />
    </View>
  )
}
