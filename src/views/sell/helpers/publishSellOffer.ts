import { publishPGPPublicKey } from '../../../init/publishPGPPublicKey'
import i18n from '../../../utils/i18n'
import { isSellOffer } from '../../../utils/offer'
import { postSellOffer } from '../../../utils/peachAPI'
import { info } from './../../../utils/log'
import { handleMultipleOffersPublished } from './handleMultipleOffersPublished'
import { handleSellOfferPublished } from './handleSellOfferPublished'

const createPayload = (offerDraft: SellOfferDraft) => ({
  type: offerDraft.type,
  amount: offerDraft.amount,
  premium: offerDraft.premium,
  meansOfPayment: offerDraft.meansOfPayment,
  paymentData: offerDraft.paymentData,
  returnAddress: offerDraft.returnAddress,
  multi: offerDraft.multi,
})

export const publishSellOffer = async (
  offerDraft: SellOfferDraft,
): Promise<{ isPublished: boolean; navigationParams: { offerId: string } | null; errorMessage: string | null }> => {
  info('Posting sell offer')

  const payload = createPayload(offerDraft)

  let [result, err] = await postSellOffer(payload)
  if (err?.error === 'PGP_MISSING') {
    await publishPGPPublicKey()
    const response = await postSellOffer(payload)
    result = response[0]
    err = response[1]
  }

  if (result && !Array.isArray(result) && isSellOffer(result)) {
    return handleSellOfferPublished(result, offerDraft)
  }
  if (result && Array.isArray(result) && result.every(isSellOffer)) {
    return handleMultipleOffersPublished(result, offerDraft)
  }
  return {
    isPublished: false,
    navigationParams: null,
    errorMessage: i18n(err?.error || 'POST_OFFER_ERROR', ((err?.details as string[]) || []).join(', ')),
  }
}
