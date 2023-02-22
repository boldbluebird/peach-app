import { error } from '../log'
import { dateTimeReviver } from '../system'
import { getResponseError } from './getResponseError'

/**
 * @description Method to parse and handle peach response
 * @param response response object
 * @param caller calling function name
 * @returns parsed Peach API Response
 */
export const parseResponse = async <T>(response: Response, caller: string): Promise<[T | null, APIError | null]> => {
  try {
    const responseError = getResponseError(response)
    if (responseError === 'ABORTED') return [null, null]
    if (responseError) return [null, { error: responseError }]

    const data = JSON.parse(await response.text(), dateTimeReviver)

    if (response.status !== 200) {
      error(
        `peachAPI - ${caller}`,
        JSON.stringify({
          status: response.status,
          data,
        }),
      )

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    error(`peachAPI - ${caller}`, e)

    return [null, { error: 'INTERNAL_SERVER_ERROR' }]
  }
}
