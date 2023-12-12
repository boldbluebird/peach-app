import { useCallback, useEffect } from 'react'
import { MSINAMINUTE } from '../../../constants'
import { useCancelOffer, useInterval, useRoute } from '../../../hooks'
import { useFundingStatus } from '../../../hooks/query/useFundingStatus'
import { useMultipleOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { isSellOffer } from '../../../utils/offer'
import { parseError } from '../../../utils/result'
import { isDefined } from '../../../utils/validation'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSyncWallet } from '../../wallet/hooks/useSyncWallet'
import { getFundingAmount } from '../helpers/getFundingAmount'
import { useHandleFundingStatus } from './useHandleFundingStatus'

const MIN_LOADING_TIME = 1000
const shouldGetFundingStatus = (offer: SellOffer) =>
  !!offer.escrow && !offer.refunded && !offer.released && offer.funding.status !== 'FUNDED'

export const useFundEscrowSetup = () => {
  const { offerId } = useRoute<'fundEscrow'>().params

  const showErrorBanner = useShowErrorBanner()
  const { refresh } = useSyncWallet()

  const fundMultiple = useWalletState((state) => state.getFundMultipleByOfferId(offerId))
  const { offers } = useMultipleOfferDetails(fundMultiple?.offerIds || [offerId])
  const offer = offers[0]
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
  const canFetchFundingStatus = !sellOffer || shouldGetFundingStatus(sellOffer)
  const {
    fundingStatus,
    userConfirmationRequired,
    error: fundingStatusError,
  } = useFundingStatus(offerId, canFetchFundingStatus)
  const escrows = offers
    .filter(isDefined)
    .filter(isSellOffer)
    .map((offr) => offr.escrow)
    .filter(isDefined)
  const fundingAmount = getFundingAmount(fundMultiple, sellOffer?.amount)
  const cancelOffer = useCancelOffer(sellOffer)

  useHandleFundingStatus({
    offerId,
    sellOffer,
    fundingStatus,
    userConfirmationRequired,
  })

  useEffect(() => {
    if (!fundingStatusError) return
    showErrorBanner(parseError(fundingStatusError))
  }, [fundingStatusError, showErrorBanner])

  const syncPeachWallet = useCallback(() => {
    if (fundMultiple) refresh()
  }, [fundMultiple, refresh])

  useInterval({ callback: syncPeachWallet, interval: MSINAMINUTE * 2 })

  return {
    offerId,
    fundingAddress: fundMultiple?.address || sellOffer?.escrow,
    fundingAddresses: escrows,
    fundingStatus,
    fundingAmount,
    cancelOffer,
  }
}
