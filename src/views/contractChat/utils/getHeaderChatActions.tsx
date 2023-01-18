import React from 'react'
import { Icon } from '../../../components'
import { ConfirmRaiseDispute } from '../../../overlays/ConfirmRaiseDispute'
import tw from '../../../styles/tailwind'
import { HeaderConfig } from '../../../components/header/store'

// eslint-disable max-params
export const getHeaderChatActions = (
  contract: Contract,
  view: 'buyer' | 'seller' | '',
  showCancelOverlay: () => void,
  updateOverlay: React.Dispatch<OverlayState>,
): HeaderConfig['icons'] => {
  const canCancel
    = !contract.disputeActive && !contract.paymentMade && !contract.canceled && !contract.cancelationRequested
  const canDispute
    = contract.symmetricKey
    && ((!contract.disputeActive && !/cash/u.test(contract.paymentMethod))
      || (view === 'seller' && contract.cancelationRequested))

  const openCancelTrade = canCancel ? showCancelOverlay : () => {}
  // const extendTime = () => alert('todo extend time')
  const raiseDispute = () =>
    canDispute
      ? updateOverlay({
        content: <ConfirmRaiseDispute contract={contract} />,
        visible: true,
      })
      : null

  return [
    {
      iconComponent: <Icon style={!canCancel && tw`opacity-50`} id="xCircle" color={tw`text-error-main`.color} />,
      onPress: openCancelTrade,
    },
    {
      iconComponent: (
        <Icon style={!canDispute && tw`opacity-50`} id="alertOctagon" color={tw`text-warning-main`.color} />
      ),
      onPress: raiseDispute,
    },
  ]
}
