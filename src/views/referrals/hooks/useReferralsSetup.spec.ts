/* eslint-disable max-lines-per-function */
import { act, renderHook } from '@testing-library/react-native'
import { defaultSelfUser } from '../../../../tests/unit/data/userData'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useReferralsSetup } from './useReferralsSetup'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'

jest.mock('../../../hooks/query/useSelfUser', () => ({
  useSelfUser: jest.fn(),
}))

const setCustomReferralCodeOverlayMock = jest.fn()
const useSetCustomReferralCodePopupMock = jest.fn().mockReturnValue({
  setCustomReferralCodeOverlay: setCustomReferralCodeOverlayMock,
})
jest.mock('../../../overlays/referral/useSetCustomReferralCodePopup', () => ({
  useSetCustomReferralCodePopup: () => useSetCustomReferralCodePopupMock(),
}))
const redeemNoPeachFeesReward = jest.fn()
const useRedeemNoPeachFeesRewardMock = jest.fn().mockReturnValue(redeemNoPeachFeesReward)
jest.mock('../../../overlays/referral/useRedeemNoPeachFeesReward', () => ({
  useRedeemNoPeachFeesReward: () => useRedeemNoPeachFeesRewardMock(),
}))

describe('useReferralsSetup', () => {
  beforeEach(() => {
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: defaultSelfUser,
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('returns default correct values', () => {
    const { result } = renderHook(useReferralsSetup, { wrapper: NavigationWrapper })

    expect(result.current.user).toEqual(defaultSelfUser)
    expect(result.current.BARLIMIT).toBeGreaterThan(0)
    expect(result.current.REWARDINFO[0]).toHaveProperty('id')
    expect(result.current.REWARDINFO[0]).toHaveProperty('requiredPoints')
    expect(result.current.pointsBalance).toEqual(defaultSelfUser.bonusPoints)
    expect(result.current.availableRewards).toEqual(0)
    expect(result.current.selectedReward).toBeUndefined()
    expect(result.current.setSelectedReward).toBeDefined()
    expect(result.current.redeem).toBeDefined()
  })
  it('sets up header correctly', () => {
    renderHook(useReferralsSetup, { wrapper: NavigationWrapper })

    expect(useHeaderState.getState().title).toBe('referrals')
    expect(useHeaderState.getState().icons?.[0]).toEqual({
      id: 'helpCircle',
      color: '#099DE2',
      onPress: expect.any(Function),
    })
  })

  it('returns correct bonus points and available rewards', () => {
    const bonusPoints = 400
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: {
        ...defaultSelfUser,
        bonusPoints,
      },
    })
    const { result } = renderHook(useReferralsSetup, { wrapper: NavigationWrapper })

    expect(result.current.pointsBalance).toEqual(bonusPoints)
    expect(result.current.availableRewards).toEqual(2)
  })
  it('returns 0 bonus points balance if user data cannot be fetched', () => {
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: undefined,
    })
    const { result } = renderHook(useReferralsSetup, { wrapper: NavigationWrapper })

    expect(result.current.pointsBalance).toEqual(0)
    expect(result.current.availableRewards).toEqual(0)
  })
  it('lets user select a reward', () => {
    const bonusPoints = 400
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: {
        ...defaultSelfUser,
        bonusPoints,
      },
    })
    const { result } = renderHook(useReferralsSetup, { wrapper: NavigationWrapper })

    expect(result.current.selectedReward).toBeUndefined()

    act(() => {
      result.current.setSelectedReward('customReferralCode')
    })
    expect(result.current.selectedReward).toEqual('customReferralCode')
  })
  it('does not let user start redemption of an unavailable reward', () => {
    const { result } = renderHook(useReferralsSetup, { wrapper: NavigationWrapper })

    act(() => {
      result.current.setSelectedReward('sats')
      result.current.redeem()
    })

    expect(setCustomReferralCodeOverlayMock).not.toHaveBeenCalled()
  })
  it('lets user start redemption of a custom referral code', () => {
    const { result } = renderHook(useReferralsSetup, { wrapper: NavigationWrapper })

    act(() => {
      result.current.setSelectedReward('customReferralCode')
    })
    act(() => {
      result.current.redeem()
    })

    expect(setCustomReferralCodeOverlayMock).toHaveBeenCalled()
  })
  it('lets user start redemption of a no peach fees', () => {
    const { result } = renderHook(useReferralsSetup, { wrapper: NavigationWrapper })

    act(() => {
      result.current.setSelectedReward('noPeachFees')
    })

    act(() => {
      result.current.redeem()
    })

    expect(redeemNoPeachFeesReward).toHaveBeenCalled()
  })
})
