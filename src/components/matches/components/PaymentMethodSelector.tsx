import React from 'react'
import shallow from 'zustand/shallow'
import { useRoute } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { isBuyOffer } from '../../../utils/offer'
import { Selector } from '../../inputs'
import { Headline } from '../../text'
import { HorizontalLine } from '../../ui'
import { useMatchStore } from '../store'

export const PaymentMethodSelector = ({ matchId }: { matchId: Match['offerId'] }) => {
  const { offer } = useRoute<'search'>().params
  const { selectedValue, setSelectedPaymentMethod, availablePaymentMethods } = useMatchStore(
    (state) => ({
      selectedValue: state.matchSelectors[matchId]?.selectedPaymentMethod,
      setSelectedPaymentMethod: state.setSelectedPaymentMethod,
      availablePaymentMethods: state.matchSelectors[matchId]?.availablePaymentMethods || [],
    }),
    shallow,
  )
  const onChange = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod, matchId)
  }
  const items = availablePaymentMethods.map((p) => ({
    value: p,
    display: i18n(`paymentMethod.${p}`),
  }))
  return (
    <>
      <HorizontalLine style={[tw`mt-4`, tw.md`mt-5`]} />
      <Headline style={[tw`mt-3 lowercase text-grey-2`, tw.md`mt-4`]}>
        {i18n(isBuyOffer(offer) ? 'form.paymentMethod' : 'match.selectedPaymentMethod')}:
      </Headline>
      <Selector style={tw`mt-2`} {...{ selectedValue, items, onChange }} />
    </>
  )
}
