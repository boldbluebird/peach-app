import React, { useContext, useEffect, useState } from 'react'
import tw from '../styles/tailwind'

import { Loading } from '../components'
import i18n from '../utils/i18n'

import { MessageContext } from '../contexts/message'
import { OverlayContext } from '../contexts/overlay'
import getContractEffect from '../effects/getContractEffect'
import { account } from '../utils/account'
import { Navigation } from '../utils/navigation'
import { getOffer } from '../utils/offer'
import { DisputeLostBuyer } from './disputeResults/DisputeLostBuyer'
import { DisputeLostSeller } from './disputeResults/DisputeLostSeller'
import { DisputeWonBuyer } from './disputeResults/DisputeWonBuyer'
import { DisputeWonSeller } from './disputeResults/DisputeWonSeller'
import { NonDispute } from './disputeResults/NonDispute'

type DisputeResultProps = {
  contractId: Contract['id'],
  navigation: Navigation,
}

export const DisputeResult = ({ contractId, navigation }: DisputeResultProps) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [contract, setContract] = useState<Contract>()
  const [offer, setOffer] = useState<BuyOffer|SellOffer>()

  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [hasWinner, setHasWinner] = useState(false)
  const [isWinner, setIsWinner] = useState(false)

  useEffect(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      const newView = result.seller.id === account.publicKey ? 'seller' : 'buyer'
      setContract(result)
      setOffer(getOffer(result.id.split('-')[newView === 'seller' ? 0 : 1]) as BuyOffer|SellOffer)

      setView(newView)
      setHasWinner(!!result.disputeWinner)
      setIsWinner(newView === result.disputeWinner)
    },
    onError: err => {
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
      updateOverlay({ content: null, showCloseButton: true })
      return navigation.navigate('contract', { contractId })
    }
  }), [contractId])

  const goToContract = () => {
    navigation.navigate('contract', { contractId })
    updateOverlay({ content: null, showCloseButton: true })
  }

  return !view || !contract || !offer
    ? <Loading color={tw`text-white-1`.color as string} />
    : !hasWinner
      ? <NonDispute contract={contract} navigate={goToContract} />
      : view === 'seller'
        ? isWinner
          ? <DisputeWonSeller contract={contract} offer={offer as SellOffer} navigate={goToContract} />
          : <DisputeLostSeller contract={contract} navigate={goToContract} />
        : isWinner
          ? <DisputeWonBuyer contract={contract} navigate={goToContract} />
          : <DisputeLostBuyer contract={contract} navigate={goToContract} />
}