import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { BitcoinAddress, Button, Text } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { saveOffer } from '../../utils/accountUtils'
import { MessageContext } from '../../utils/messageUtils'
import { PEACHFEE } from '../../constants'
import createEscrowEffect from './effects/createEscrowEffect'
import checkFundingStatusEffect from './effects/checkFundingStatusEffect'

const defaultFunding: FundingStatus = {
  confirmations: 0,
  status: 'NULL',
  amount: 0
}

type FundingViewProps = {
  offer: SellOffer,
  escrow: string,
  fundingStatus: FundingStatus,
}
const FundingView = ({ offer, escrow, fundingStatus }: FundingViewProps): ReactElement => <View>
  <Text>Send: {Math.round(offer.amount * (1 + PEACHFEE / 100))} sats to</Text>
  <BitcoinAddress
    style={tw`my-4`}
    address={escrow}
    showQR={true}
  />
  <Text>Confirmations: {fundingStatus.confirmations}</Text>
  <Text>Status: {fundingStatus.status}</Text>
</View>
const Refund = () => <View style={tw`flex justify-center items-center`}>
  <Text>
    {i18n('error.WRONG_FUNDING_AMOUNT')}
  </Text>
  <Button
    style={tw`mt-6`}
    wide={false}
    onPress={() => {}} // TODO add refunding logic
    title={i18n('refund')}
  />
</View>

// TODO: create escrow not found error message here
const NoEscrowFound = () => <Text>404 Escrow not found</Text>

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [escrow, setEscrow] = useState(offer.escrow || '')
  const [fundingError, setFundingError] = useState<FundingError>('')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(offer.funding || defaultFunding)

  const saveAndUpdate = (offerData: SellOffer) => {
    updateOffer(offerData)
    saveOffer(offerData)
  }

  useEffect(createEscrowEffect({
    offer,
    onSuccess: result => {
      setEscrow(() => result.escrow)
      setFundingStatus(() => result.funding)
      saveAndUpdate({
        ...offer,
        escrow: result.escrow,
        funding: result.funding,
      })
    },
    onError: () => {
      updateMessage({
        msg: i18n('error.createEscrow'),
        level: 'ERROR',
      })
    }
  }), [])

  useEffect(checkFundingStatusEffect({
    offer,
    onSuccess: result => {
      setFundingStatus(() => result.funding)
      saveAndUpdate({
        ...offer,
        funding: result.funding,
      })
      setFundingError(() => result.error || '')
    },
    onError: () => {
      // TODO treat API Error case (404, 500, etc)
    },
  }), [offer.offerId])

  useEffect(() => {
    if (fundingStatus && /MEMPOOL|FUNDED/u.test(fundingStatus.status)) setStepValid(true)
  }, [fundingStatus])

  useEffect(() => {
    // workaround to update escrow status if offer changes
    setEscrow(() => offer.escrow || '')
    setFundingStatus(() => offer.funding || defaultFunding)
  }, [offer.offerId])

  return <View style={tw`mt-16`}>
    {fundingStatus && !fundingError
      ? <FundingView offer={offer} escrow={escrow} fundingStatus={fundingStatus} />
      : fundingError && fundingError === 'WRONG_FUNDING_AMOUNT'
        ? <Refund />
        : <NoEscrowFound />
    }
  </View>
}