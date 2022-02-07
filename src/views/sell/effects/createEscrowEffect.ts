import { EffectCallback } from 'react'
import i18n from '../../../utils/i18n'
import { error } from '../../../utils/logUtils'
import { createEscrow } from '../../../utils/peachAPI'
import { getPublicKeyForEscrow } from '../../../utils/walletUtils'

type CreateEscrowIfNewProps = {
  offer: SellOffer,
  onSuccess: (result: CreateEscrowResponse) => void,
  onError: (error: APIError) => void,
}
export default ({
  offer,
  onSuccess,
  onError
}: CreateEscrowIfNewProps): EffectCallback => () => {
  (async () => {
    if (!offer.offerId || offer.escrow) return

    const publicKey = getPublicKeyForEscrow(offer.offerId)
    const [result, err] = await createEscrow({
      offerId: offer.offerId,
      publicKey
    })

    if (result) {
      onSuccess(result)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  })()
}