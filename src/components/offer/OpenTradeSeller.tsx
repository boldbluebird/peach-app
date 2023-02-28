import React, { ReactElement, useEffect, useMemo, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import { useMeetupEventsStore } from '../../store/meetupEventsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getPaymentDataByMethod } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { ChatButton } from '../chat/ChatButton'
import { MatchCardCounterparty } from '../matches/components/MatchCardCounterparty'
import { paymentDetailTemplates } from '../payment'
import CashDetails from '../payment/detail/cash'
import { CashTradeDetails } from '../payment/detail/cashTrades'
import PeachScrollView from '../PeachScrollView'
import { PriceFormat, Text } from '../text'
import { ErrorBox, HorizontalLine } from '../ui'
import { Escrow } from './Escrow'
import { PaymentMethod } from './PaymentMethod'
import { TradeSummaryProps } from './TradeSummary'

export const OpenTradeSeller = ({ contract }: TradeSummaryProps): ReactElement => {
  let scroll = useRef<ScrollView>(null).current

  const storedPaymentData = useMemo(
    () =>
      contract.paymentData
        ? getPaymentDataByMethod(contract.paymentMethod, hashPaymentData(contract.paymentData))
        : null,
    [contract],
  )

  const PaymentTo = !storedPaymentData && contract.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null

  useEffect(() => {
    scroll?.flashScrollIndicators()
  }, [scroll])

  const getMeetupEvent = useMeetupEventsStore((state) => state.getMeetupEvent)

  return (
    <View style={tw`max-h-full`}>
      <View style={tw`px-7`}>
        <MatchCardCounterparty user={contract.buyer} />
        <HorizontalLine style={tw`mt-7`} />
      </View>
      <PeachScrollView
        scrollRef={(ref) => (scroll = ref)}
        style={tw`flex-shrink`}
        contentContainerStyle={tw`px-7`}
        showsVerticalScrollIndicator
        persistentScrollbar
      >
        <View style={tw`flex-row items-center justify-between mt-6`}>
          <Text style={tw`text-black-2`}>{i18n('contract.willPayYou')}</Text>
          <View style={tw`flex-row items-center`}>
            <PriceFormat style={tw`subtitle-1`} amount={contract.price} currency={contract.currency} />
          </View>
        </View>
        <View style={tw`flex-row items-center justify-between mt-4`}>
          <Text style={tw`text-black-2`}>{i18n('contract.summary.via')}</Text>
          <PaymentMethod
            paymentMethod={contract.paymentMethod.includes('cash.') ? 'cash' : contract.paymentMethod}
            showLink={false}
          />
        </View>

        {storedPaymentData
          && (contract.paymentMethod.includes('cash.') ? (
            <CashTradeDetails contract={contract} />
          ) : (
            <View style={tw`flex-row items-start justify-between mt-4`}>
              <Text style={tw`text-black-2`}>{i18n('contract.payment.to')}</Text>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`ml-4 leading-normal text-right subtitle-1`}>{storedPaymentData.label}</Text>
              </View>
            </View>
          ))}
        {!!contract.paymentData && !!PaymentTo && (
          <PaymentTo style={tw`mt-4`} paymentData={contract.paymentData} country={contract.country} copyable={false} />
        )}
        {!contract.paymentData && contract.error === 'DECRYPTION_ERROR' && (
          <ErrorBox style={tw`mt-4`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
        )}

        <HorizontalLine style={tw`mt-6`} />
        <View style={tw`flex-row justify-center mt-6`}>
          {(!!contract.escrow || !!contract.releaseTxId) && <Escrow contract={contract} style={tw`mr-3 min-w-24`} />}
          <ChatButton contract={contract} style={tw`min-w-24`} />
        </View>
      </PeachScrollView>
    </View>
  )
}
