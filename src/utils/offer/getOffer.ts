import { account } from '../account'

/**
  * @description Method to get saved offer
  * @param id offer id
  * @returns offer
  */
export const getOffer = (id: string): SellOffer|BuyOffer|null => {
  const offer = account.offers.find(c => c.id === id)

  if (!offer) return null

  offer.matches = offer.matches || []
  offer.seenMatches = offer.seenMatches || []
  return offer
}