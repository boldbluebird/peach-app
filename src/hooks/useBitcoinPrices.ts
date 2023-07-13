import { SATSINBTC } from '../constants'
import { useSettingsStore } from '../store/settingsStore'
import { round } from '../utils/math'
import { keys } from '../utils/object'
import { useMarketPrices } from './query/useMarketPrices'

type Props = {
  sats: number
}

export const useBitcoinPrices = ({ sats }: Props) => {
  const { data: marketPrices } = useMarketPrices()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)

  if (!marketPrices) return {
    displayCurrency,
    displayPrice: 0,
    prices: {},
    fullDisplayPrice: 0,
    fullPrices: {},
  }

  const prices = keys(marketPrices).reduce((obj, currency) => {
    const marketPrice = marketPrices[currency] ?? 0
    obj[currency] = round((marketPrice / SATSINBTC) * sats, 2)
    return obj
  }, {} as Pricebook)

  return {
    displayCurrency,
    displayPrice: prices[displayCurrency] ?? 0,
    prices,
    fullDisplayPrice: marketPrices[displayCurrency] ?? 0,
    fullPrices: marketPrices,
  }
}
