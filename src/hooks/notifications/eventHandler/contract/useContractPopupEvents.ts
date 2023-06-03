import { useMemo } from 'react'
import { useConfirmTradeCancelationOverlay } from '../../../../overlays/tradeCancelation'
import { useTradeCanceledPopup } from '../../../../overlays/tradeCancelation/useTradeCanceledPopup'
import { usePaymentTooLatePopup } from '../../../../overlays/usePaymentTooLatePopup'

type PNEventHandlers = Partial<Record<NotificationType, (contract: Contract) => void>>

export const useContractPopupEvents = () => {
  const { showConfirmTradeCancelation } = useConfirmTradeCancelationOverlay()
  const { showTradeCanceled } = useTradeCanceledPopup()
  const showPaymentTooLateOverlay = usePaymentTooLatePopup()

  const contractPopupEvents: PNEventHandlers = useMemo(
    () => ({
      'contract.canceled': (contract: Contract) => showTradeCanceled(contract, false),
      // PN-S14
      'seller.canceledAfterEscrowExpiry': (contract: Contract) => showTradeCanceled(contract, false),
      // PN-B08
      'contract.cancelationRequest': (contract: Contract) =>
        !contract.disputeActive ? showConfirmTradeCancelation(contract) : null,
      // PN-B12
      'contract.buyer.paymentTimerHasRunOut': () => showPaymentTooLateOverlay(),
    }),
    [showConfirmTradeCancelation, showPaymentTooLateOverlay, showTradeCanceled],
  )

  return contractPopupEvents
}
