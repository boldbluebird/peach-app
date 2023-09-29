import { render } from '@testing-library/react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { Buy } from './Buy'
expect.extend({ toMatchDiffSnapshot })

const useMarketPricesMock = jest.fn().mockReturnValue({
  data: {
    EUR: 20000,
    CHF: 21000,
  },
})
jest.mock('../../hooks/query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))

const next = jest.fn()
const buySetup = { freeTrades: 0, maxFreeTrades: 5, isLoading: false, rangeIsValid: true, next }
const useBuySetupMock = jest.fn().mockResolvedValue(buySetup)
jest.mock('./hooks/useBuySetup', () => ({
  useBuySetup: () => useBuySetupMock(),
}))

const wrapper = NavigationAndQueryClientWrapper

jest.useFakeTimers()

describe('Buy', () => {
  beforeAll(() => {
    useBitcoinStore.setState({
      currency: 'EUR',
      satsPerUnit: 250,
      price: 400000,
    })
    useOfferPreferences.getState().setBuyAmountRange([0, 1000000], { min: 0, max: 10 })
  })
  it('should render correctly while loading max trading amount', () => {
    useBuySetupMock.mockReturnValueOnce({ ...buySetup, isLoading: true })
    const { toJSON } = render(<Buy />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly', () => {
    const { toJSON } = render(<Buy />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with free trades', () => {
    const withoutFreeTrades = render(<Buy />, { wrapper }).toJSON()
    const freeTrades = 5
    useBuySetupMock.mockReturnValueOnce({ ...buySetup, freeTrades, maxFreeTrades: 5 })
    const { toJSON } = render(<Buy />, { wrapper })
    expect(withoutFreeTrades).toMatchDiffSnapshot(toJSON())
  })
})
