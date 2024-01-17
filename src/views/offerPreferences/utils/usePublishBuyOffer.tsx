import { useMutation } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { useSetOverlay } from '../../../Overlay'
import { useSetPopup } from '../../../components/popup/Popup'
import { useNavigation } from '../../../hooks/useNavigation'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { InfoPopup } from '../../../popups/InfoPopup'
import { useConfigStore } from '../../../store/configStore/configStore'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import { useAccountStore } from '../../../utils/account/account'
import { getMessageToSignForAddress } from '../../../utils/account/getMessageToSignForAddress'
import i18n from '../../../utils/i18n'
import { peachAPI } from '../../../utils/peachAPI'
import { isPaymentMethod } from '../../../utils/validation/isPaymentMethod'
import { isValidBitcoinSignature } from '../../../utils/validation/isValidBitcoinSignature'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { GroupHugAnnouncement } from '../../overlays/GroupHugAnnouncement'

const isForbiddenPaymentMethodError = (
  errorMessage: string | null,
  errorDetails: unknown,
): errorDetails is PaymentMethod[] =>
  errorMessage === 'FORBIDDEN' && Array.isArray(errorDetails) && errorDetails.every(isPaymentMethod)

export function usePublishBuyOffer ({
  amount,
  meansOfPayment,
  paymentData,
  maxPremium,
  minReputation,
}: Pick<BuyOfferDraft, 'amount' | 'meansOfPayment' | 'paymentData' | 'maxPremium' | 'minReputation'>) {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const hasSeenGroupHugAnnouncement = useConfigStore((state) => state.hasSeenGroupHugAnnouncement)
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<InfoPopup content={i18n('FORBIDDEN_PAYMENT_METHOD.paypal.text')} />)
  const publicKey = useAccountStore((state) => state.account.publicKey)
  const setOverlay = useSetOverlay()
  const [payoutAddress, payoutToPeachWallet, payoutAddressSignature] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutToPeachWallet, state.payoutAddressSignature],
    shallow,
  )

  return useMutation({
    mutationFn: async () => {
      const { address: releaseAddress, index } = payoutToPeachWallet
        ? await peachWallet.getAddress()
        : { address: payoutAddress, index: undefined }
      if (!releaseAddress) throw new Error('MISSING_RELEASE_ADDRESS')

      const message = getMessageToSignForAddress(publicKey, releaseAddress)
      const messageSignature = payoutToPeachWallet
        ? peachWallet.signMessage(message, releaseAddress, index)
        : payoutAddressSignature

      if (!messageSignature || !isValidBitcoinSignature(message, releaseAddress, messageSignature)) {
        throw new Error('INAVLID_SIGNATURE')
      }
      const finalizedOfferDraft = {
        type: 'bid' as const,
        amount,
        meansOfPayment,
        paymentData,
        maxPremium,
        minReputation,
        releaseAddress,
        message,
        messageSignature,
      }

      const { result, error: err } = await peachAPI.private.offer.postBuyOffer(finalizedOfferDraft)

      if (result) return result.id
      throw new Error(err?.error || 'POST_OFFER_ERROR', { cause: err?.details })
    },
    onError: ({ message, cause }: Error) => {
      if (isForbiddenPaymentMethodError(message, cause)) {
        const paymentMethod = cause.pop()
        if (paymentMethod === 'paypal') showHelp()
      } else {
        showErrorBanner(message)
      }
    },
    onSuccess: (offerId) => {
      if (!hasSeenGroupHugAnnouncement) setOverlay(<GroupHugAnnouncement offerId={offerId} />)
      navigation.reset({
        index: 1,
        routes: [
          { name: 'homeScreen', params: { screen: 'yourTrades' } },
          { name: 'explore', params: { offerId } },
        ],
      })
    },
  })
}
