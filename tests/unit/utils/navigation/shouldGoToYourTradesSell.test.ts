import { shouldGoToYourTradesSell } from '../../../../src/utils/navigation/shouldGoToYourTradesSell'

describe('shouldGoToYourTradesSell', () => {
  it('should return false if offerId is not defined', () => {
    expect(shouldGoToYourTradesSell({ data: { offerId: '', type: 'offer.notFunded' } })).toBe(false)
  })

  it('should return true if messageType is offer.sellOfferExpired and offerId is defined', () => {
    expect(shouldGoToYourTradesSell({ data: { offerId: 'test', type: 'offer.sellOfferExpired' } })).toBe(true)
  })

  it('should return true if messageType is offer.fundingAmountDifferent and offerId is defined', () => {
    expect(shouldGoToYourTradesSell({ data: { offerId: 'test', type: 'offer.fundingAmountDifferent' } })).toBe(true)
  })

  it('should return true if messageType is offer.wrongFundingAmount and offerId is defined', () => {
    expect(shouldGoToYourTradesSell({ data: { offerId: 'test', type: 'offer.wrongFundingAmount' } })).toBe(true)
  })

  it('should return false if messageType is something else', () => {
    expect(shouldGoToYourTradesSell({ data: { offerId: 'test', type: 'offer.buyOfferExpired' } })).toBe(false)
  })
})
