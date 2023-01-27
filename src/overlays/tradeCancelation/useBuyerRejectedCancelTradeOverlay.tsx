import React, { useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { BuyerRejectedCancelTrade } from './BuyerRejectedCancelTrade'

export const useBuyerRejectedCancelTradeOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)

  const confirmOverlay = (contract: Contract) => {
    updateOverlay({ visible: false })
    saveContract({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  }

  return (contract: Contract) => {
    updateOverlay({
      title: i18n('contract.cancel.buyerRejected.title'),
      content: <BuyerRejectedCancelTrade contract={contract} />,
      visible: true,
      requireUserAction: true,
      level: 'WARN',
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: () => confirmOverlay(contract),
      },
    })
  }
}
