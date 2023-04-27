import { useEffect } from 'react'
import { useNavigation } from '../../../hooks'
import { info } from '../../../utils/log'
import { saveOffer } from '../../../utils/offer'
import { useStartRefundOverlay } from '../../../overlays/useStartRefundOverlay'
import { useWronglyFundedOverlay } from '../../../overlays/useWronglyFundedOverlay'
import { useConfirmEscrowOverlay } from '../../../overlays/useConfirmEscrowOverlay'
import { useOfferMatches } from '../../search/hooks/useOfferMatches'

type Props = {
  offerId: string
  sellOffer?: SellOffer
  fundingStatus: FundingStatus
  userConfirmationRequired: boolean
}
export const useHandleFundingStatus = ({ offerId, sellOffer, fundingStatus, userConfirmationRequired }: Props) => {
  const navigation = useNavigation()
  const startRefund = useStartRefundOverlay()
  const showWronglyFundedOverlay = useWronglyFundedOverlay()
  const showEscrowConfirmOverlay = useConfirmEscrowOverlay()
  const { refetch: fetchMatches } = useOfferMatches(offerId, fundingStatus.status === 'FUNDED')

  useEffect(() => {
    if (!sellOffer) return

    info('Checked funding status', fundingStatus)
    const updatedOffer = {
      ...sellOffer,
      funding: fundingStatus,
    }

    saveOffer(updatedOffer)

    if (fundingStatus.status === 'CANCELED') {
      startRefund(sellOffer)
      return
    }
    if (fundingStatus.status === 'WRONG_FUNDING_AMOUNT') {
      showWronglyFundedOverlay(updatedOffer)
      return
    }
    if (userConfirmationRequired) {
      showEscrowConfirmOverlay(updatedOffer)
      return
    }
    if (fundingStatus.status === 'FUNDED') {
      fetchMatches().then(({ data }) => {
        const allMatches = (data?.pages || []).flatMap((page) => page.matches)
        const hasMatches = allMatches.length > 0
        if (hasMatches) {
          navigation.replace('search', { offerId })
        } else {
          navigation.replace('offerPublished', { isSellOffer: true })
        }
      })
    }
  }, [
    fetchMatches,
    fundingStatus,
    navigation,
    offerId,
    sellOffer,
    showEscrowConfirmOverlay,
    showWronglyFundedOverlay,
    startRefund,
    userConfirmationRequired,
  ])
}
