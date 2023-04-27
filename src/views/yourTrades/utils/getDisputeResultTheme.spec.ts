import tw from '../../../styles/tailwind'
import { getDisputeResultTheme } from '.'

describe('getDisputeResultTheme', () => {
  const wonAsBuyer = {
    type: 'bid',
    disputeWinner: 'buyer',
  } as const
  const wonAsSeller = {
    type: 'ask',
    disputeWinner: 'seller',
  } as const

  const lostAsBuyer = {
    type: 'bid',
    disputeWinner: 'seller',
  } as const

  const lostAsSeller = {
    type: 'ask',
    disputeWinner: 'buyer',
  } as const

  it('returns the correct theme for a contract summary where you won the dispute as buyer', () => {
    const theme = getDisputeResultTheme(wonAsBuyer)
    expect(theme).toEqual({
      icon: 'buy',
      level: 'SUCCESS',
      color: tw`text-success-main`.color,
    })
  })

  it('returns the correct theme for a contract summary where you won the dispute as seller', () => {
    const theme = getDisputeResultTheme(wonAsSeller)
    expect(theme).toEqual({
      icon: 'alertOctagon',
      level: 'SUCCESS',
      color: tw`text-primary-main`.color,
    })
  })
  it('returns the correct theme for a lost dispute as a seller', () => {
    const themeSeller = getDisputeResultTheme(lostAsSeller)
    expect(themeSeller).toEqual({
      icon: 'alertOctagon',
      level: 'ERROR',
      color: tw`text-warning-main`.color,
    })
  })
  it('returns the correct theme for a lost dispute as a buyer', () => {
    const themeBuyer = getDisputeResultTheme(lostAsBuyer)
    expect(themeBuyer).toEqual({
      icon: 'alertOctagon',
      level: 'ERROR',
      color: tw`text-warning-main`.color,
    })
  })
})
