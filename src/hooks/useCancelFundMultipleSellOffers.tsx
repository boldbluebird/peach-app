import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { CancelOffer } from '../popups/CancelOffer'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { cancelOffer } from '../utils/peachAPI'
import { getError, getResult, parseError } from '../utils/result'
import { FundMultipleInfo, useWalletState } from '../utils/wallet/walletStore'
import { useNavigation } from './useNavigation'
import { useShowErrorBanner } from './useShowErrorBanner'

type Props = {
  fundMultiple?: FundMultipleInfo
}
export const useCancelFundMultipleSellOffers = ({ fundMultiple }: Props) => {
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const showOfferCanceled = useCallback(() => {
    setPopup({ title: i18n('offer.canceled.popup.title'), level: 'DEFAULT' })
  }, [setPopup])

  const confirmCancelOffer = useCallback(async () => {
    if (!fundMultiple) return

    const results = await Promise.all(
      fundMultiple.offerIds?.map(async (offerId) => {
        const [cancelResult, cancelError] = await cancelOffer({ offerId })
        if (cancelError) return getError(cancelError?.error)
        if (!cancelResult) return getError(null)
        return getResult(cancelResult)
      }),
    )

    const notCanceledOffers = fundMultiple.offerIds.filter((offerId, i) => results[i].isError())
    const error = results.find((result) => result.isError())
    const errorMessage = error?.isError() ? error.getError() : undefined

    if (notCanceledOffers.length > 0) {
      useWalletState.getState().registerFundMultiple(fundMultiple.address, notCanceledOffers)
    } else {
      useWalletState.getState().unregisterFundMultiple(fundMultiple.address)
    }

    if (errorMessage) {
      showError(parseError(errorMessage))
    }
    showOfferCanceled()
    navigation.replace('sell')
  }, [fundMultiple, navigation, showError, showOfferCanceled])

  const showCancelSellOffersPopup = useCallback(() => {
    setPopup({
      title: i18n('offer.cancel.popup.title'),
      content: <CancelOffer type="ask" />,
      visible: true,
      level: 'DEFAULT',
      action2: {
        label: i18n('neverMind'),
        icon: 'arrowLeftCircle',
        callback: closePopup,
      },
      action1: {
        label: i18n('cancelOffer'),
        icon: 'xCircle',
        callback: confirmCancelOffer,
      },
    })
  }, [closePopup, confirmCancelOffer, setPopup])

  return showCancelSellOffersPopup
}
