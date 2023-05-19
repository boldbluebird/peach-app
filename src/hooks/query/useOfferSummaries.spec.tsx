import { act, renderHook, waitFor } from '@testing-library/react-native'
import { QueryClientWrapper, queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { defaultTradeSummaryState, tradeSummaryStore } from '../../store/tradeSummaryStore'
import { useOfferSummaries } from './useOfferSummaries'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { offerSummary } from '../../../tests/unit/data/offerSummaryData'

const getOfferSummariesMock = jest.fn().mockResolvedValue([[offerSummary]])
jest.mock('../../utils/peachAPI', () => ({
  getOfferSummaries: () => getOfferSummariesMock(),
}))

jest.useFakeTimers()

describe('useOfferSummaries', () => {
  const localOfferSummary: OfferSummary = { ...offerSummary, tradeStatus: 'tradeCanceled' }

  beforeEach(() => {
    act(() => tradeSummaryStore.setState(defaultTradeSummaryState))
  })

  afterEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })
  it('fetches offer summaries from API and stores in local store', async () => {
    const { result } = renderHook(useOfferSummaries, { wrapper: QueryClientWrapper })

    expect(result.current.offers).toEqual([])
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offers).toEqual([offerSummary])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.refetch).toBeInstanceOf(Function)
    expect(result.current.error).toBeFalsy()

    expect(tradeSummaryStore.getState().offers).toEqual([offerSummary])
  })
  it('returns local offer summaries first if given', async () => {
    tradeSummaryStore.setState({ offers: [localOfferSummary], lastModified: new Date() })
    const { result } = renderHook(useOfferSummaries, { wrapper: QueryClientWrapper })

    expect(result.current.offers).toEqual([localOfferSummary])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeTruthy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offers).toEqual([offerSummary])
  })
  it('returns local offer summary if given and server did not return result', async () => {
    tradeSummaryStore.setState({ offers: [localOfferSummary], lastModified: new Date() })
    getOfferSummariesMock.mockResolvedValueOnce([null])

    const { result } = renderHook(useOfferSummaries, { wrapper: QueryClientWrapper })

    expect(result.current.offers).toEqual([localOfferSummary])
    expect(result.current.isLoading).toBeFalsy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))
    expect(result.current.offers).toEqual([localOfferSummary])
  })
  it('returns error if server did return error and no local offer summaries exists', async () => {
    getOfferSummariesMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useOfferSummaries, { wrapper: QueryClientWrapper })

    expect(result.current.offers).toEqual([])
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offers).toEqual([])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.error).toEqual(new Error(unauthorizedError.error))
  })
})
