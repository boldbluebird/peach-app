import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import BitcoinContext, { getBitcoinContext } from '../../components/bitcoin'
import { SellViewProps } from './Sell'
import { account, updateSettings } from '../../utils/accountUtils'
import Premium from './components/Premium'
import Currencies from './components/Currencies'
import KYC from './components/KYC'
import PaymentMethodSelection from './components/PaymentMethodSelection'

const validate = (offer: SellOffer) =>
  !!offer.amount
  && offer.currencies.length > 0
  && offer.paymentData.length > 0

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const { currency } = getBitcoinContext()
  const [currencies, setCurrencies] = useState(account.settings.currencies || [])
  const [premium, setPremium] = useState(account.settings.premium || 1.5)
  const [paymentData, setPaymentData] = useState(account.paymentData || [])
  const [kyc, setKYC] = useState(account.settings.kyc || false)
  const [kycType, setKYCType] = useState(account.settings.kycType || 'iban')

  useEffect(() => {
    updateOffer({
      ...offer,
      currencies,
      paymentData: paymentData.filter(data => data.selected),
      premium,
      kyc,
      kycType,
    })
    updateSettings({
      currencies,
      premium,
      kyc,
      kycType,
    })
  }, [currencies, paymentData, premium, kyc, kycType])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return <View style={tw`mb-16`}>
    <Currencies currencies={currencies} setCurrencies={setCurrencies} />
    <PaymentMethodSelection setPaymentData={setPaymentData} />
    <Premium
      premium={premium}
      setPremium={setPremium}
      identifier={`${currencies.join()}${paymentData.join()}${kyc}`}
      offer={offer}
      currency={currency}
    />
    <KYC kyc={kyc} setKYC={setKYC} kycType={kycType} setKYCType={setKYCType} />
  </View>
}