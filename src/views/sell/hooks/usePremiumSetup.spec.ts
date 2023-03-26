import { act, renderHook } from '@testing-library/react-native'
import { usePremiumSetup } from './usePremiumSetup'
import { getSellOfferDraft } from '../helpers/getSellOfferDraft'
import { account1 } from '../../../../tests/unit/data/accountData'
import { defaultLimits } from '../../../utils/account/account'

const setPremiumMock = jest.fn()
const premium = 1.5
const state = {
  premium: 1.5,
  setPremium: setPremiumMock,
}
const useSettingsStoreMock = jest.fn().mockImplementation((selector, _compareFn) => selector(state))
jest.mock('../../../store/settingsStore', () => ({
  useSettingsStore: (selector: any, compareFn: any) => useSettingsStoreMock(selector, compareFn),
}))
const useMarketPricesMock = jest.fn().mockReturnValue({
  data: {
    EUR: 20000,
    CHF: 20000,
  },
})
jest.mock('../../../hooks/query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))
const useTradingLimitsMock = jest.fn().mockReturnValue({ limits: defaultLimits })
jest.mock('../../../hooks/query/useTradingLimits', () => ({
  useTradingLimits: () => useTradingLimitsMock(),
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))

jest.mock('zustand/shallow', () => jest.fn())

const useSellSetupMock = jest.fn()
jest.mock('./useSellSetup', () => ({
  useSellSetup: (...args: any) => useSellSetupMock(...args),
}))

describe('usePremiumSetup', () => {
  const sellAmount = 100000
  const sellOfferDraft = getSellOfferDraft({ sellAmount, premium })
  const setOfferDraftMock = jest.fn((fn) => fn())
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns default values correctly', () => {
    const { result } = renderHook(() => usePremiumSetup(sellOfferDraft, setOfferDraftMock))

    expect(result.current.premium).toBe(premium.toString())
    expect(result.current.updatePremium).toBeInstanceOf(Function)
    expect(result.current.currentPrice).toBe(20.3)
    expect(result.current.displayCurrency).toBe(account1.settings.displayCurrency)
    expect(result.current.stepValid).toBeTruthy()
  })
  it('calls useSellSetup with correct params', () => {
    renderHook(() => usePremiumSetup(sellOfferDraft, setOfferDraftMock))

    expect(useSellSetupMock).toHaveBeenCalledWith({ help: 'premium' })
  })

  it('updatePremium is updating the premium', () => {
    const { result } = renderHook(() => usePremiumSetup(sellOfferDraft, setOfferDraftMock))

    act(() => {
      result.current.updatePremium(10)
    })
    expect(result.current.premium).toBe('10')
    expect(setOfferDraftMock).toHaveBeenCalledTimes(2)
  })

  it('defaults to a price of 0 if the market price is not available', () => {
    useMarketPricesMock.mockReturnValue({ data: null })
    const { result } = renderHook(() => usePremiumSetup(sellOfferDraft, setOfferDraftMock))

    expect(result.current.currentPrice).toBe(0)
  })
})
