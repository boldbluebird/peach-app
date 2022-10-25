import { API_URL } from '@env'
import { parseResponse, RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { getAccessToken } from '../user'

type MatchProps = RequestProps & {
  offerId: string
  matchingOfferId: string
  currency: Currency
  paymentMethod: PaymentMethod
  symmetricKeyEncrypted?: string
  symmetricKeySignature?: string
  paymentDataEncrypted?: string
  paymentDataSignature?: string
  hashedPaymentData?: string
}

/**
 * TODO: for KYC, send encrypted (using seller PGP key) KYC data
 * @description Method to match an offer
 * @returns MatchResponse
 */
export const matchOffer = async ({
  offerId,
  currency,
  paymentMethod,
  matchingOfferId,
  symmetricKeyEncrypted,
  symmetricKeySignature,
  paymentDataEncrypted,
  paymentDataSignature,
  hashedPaymentData,
  timeout,
}: MatchProps): Promise<[MatchResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      matchingOfferId,
      currency,
      paymentMethod,
      symmetricKeyEncrypted,
      symmetricKeySignature,
      paymentDataEncrypted,
      paymentDataSignature,
      hashedPaymentData,
    }),
    method: 'POST',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<MatchResponse>(response, 'matchOffer')
}
