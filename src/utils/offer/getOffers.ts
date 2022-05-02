import { account } from '../account'
import { getOffer } from './getOffer'

/**
  * @description Method to get saved offers
  * @returns offer
  */
export const getOffers = (): (SellOffer|BuyOffer)[] => account.offers
  .map(o => getOffer(o.id) as (SellOffer|BuyOffer))
  .sort((a, b) => Number(a.id) < Number(b.id) ? 1 : -1)