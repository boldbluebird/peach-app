import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Card, SatsFormat, Text } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { getBitcoinContext } from '../../components/bitcoin'
import { unique } from '../../utils/arrayUtils'
import Title from './components/Title'

export default ({ offer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const { currency, price } = getBitcoinContext()

  useEffect(() => setStepValid(true))

  return <View>
    <Title subtitle={i18n('sell.summary.subtitle')} />
    <View style={tw`mt-16`}>
      <Card style={tw`p-4`}>
        <View style={tw`flex-row`}>
          <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('amount')}:</Text>
          <Text style={tw`w-5/8`}>
            <SatsFormat sats={offer.amount} color={tw`text-black-1`} />
          </Text>
        </View>
        <View style={tw`flex-row mt-3`}>
          <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('price')}:</Text>
          <View style={tw`w-5/8`}>
            <View>
              <Text>
                {i18n(`currency.format.${currency}`, (price * offer.amount / 100000000).toFixed(2))}
              </Text>
            </View>
            <View>
              <Text>
                ({i18n('form.premium.youget')} {offer.premium}% {i18n(offer.premium >= 0 ? 'form.premium.more' : 'form.premium.less')}) { // eslint-disable-line max-len
                }
              </Text>
            </View>
          </View>
        </View>
        <View style={tw`flex-row mt-3`}>
          <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('currencies')}:</Text>
          <View style={tw`w-5/8`}>
            {offer.currencies.map(c => <View key={c}><Text>{c}</Text></View>)}
          </View>
        </View>
        <View style={tw`flex-row mt-3`}>
          <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('payment')}:</Text>
          <View style={tw`w-5/8`}>
            {offer.paymentData
              .filter(unique('type'))
              .map(p =>
                <View key={p.type}>
                  <Text>{i18n(`paymentMethod.${p.type}`)}</Text>
                </View>
              )
            }
          </View>
        </View>
        <View style={tw`flex-row mt-3`}>
          <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('kyc')}:</Text>
          <Text style={tw`w-5/8`}>
            {offer.kyc ? i18n(`sell.kyc.${offer.kycType}`) : i18n('no')}
          </Text>
        </View>
      </Card>
    </View>
  </View>
}