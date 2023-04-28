import { useOverlayContext } from '../../../contexts/overlay'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowLoadingOverlay } from '../../../hooks/useShowLoadingOverlay'
import { saveContract, signReleaseTx } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { confirmPayment } from '../../../utils/peachAPI'

export const useReleaseEscrow = (contract: Contract) => {
  const [, updateOverlay] = useOverlayContext()

  const showError = useShowErrorBanner()
  const showLoadingOverlay = useShowLoadingOverlay()
  const closeOverlay = () => {
    updateOverlay({ visible: false })
  }
  const releaseEscrow = async () => {
    showLoadingOverlay({
      title: i18n('dispute.lost'),
      level: 'WARN',
    })
    const [tx, errorMsg] = signReleaseTx(contract)
    if (!tx) {
      closeOverlay()
      return showError(errorMsg)
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })
    if (err) {
      closeOverlay()
      return showError(err.error)
    }

    saveContract({
      ...contract,
      paymentConfirmed: new Date(),
      cancelConfirmationDismissed: true,
      releaseTxId: result?.txId || '',
      disputeResultAcknowledged: true,
      disputeResolvedDate: new Date(),
    })
    return closeOverlay()
  }

  return releaseEscrow
}
