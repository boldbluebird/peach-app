import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetOfferProps = RequestProps

/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getOfferSummaries = async ({
  timeout,
  abortSignal,
}: GetOfferProps): Promise<[GetOfferSummariesResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offers/summary`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  const parsedResponse = await parseResponse<GetOfferSummariesResponse>(response, 'getOfferSummaries')

  if (parsedResponse[0]) {
    parsedResponse[0] = parsedResponse[0].map((offer) => ({
      ...offer,
      creationDate: new Date(offer.creationDate),
      lastModified: new Date(offer.lastModified),
    }))
  }
  return parsedResponse
}
