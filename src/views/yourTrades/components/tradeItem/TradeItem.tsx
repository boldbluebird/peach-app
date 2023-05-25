import { useMemo } from 'react'
import { Icon } from '../../../../components'
import tw from '../../../../styles/tailwind'
import { ContractItem } from './ContractItem'
import { OfferItem } from './OfferItem'
import { getThemeForTradeItem, isContractSummary, isPastOffer } from '../../utils'

type TradeItemProps = {
  item: TradeSummary
}
export const TradeItem = ({ item }: TradeItemProps) => {
  const tradeTheme = useMemo(() => getThemeForTradeItem(item), [item])
  const icon = isPastOffer(item.tradeStatus) ? (
    <Icon id={tradeTheme.icon} style={tw`w-4 h-4`} color={tradeTheme.color} />
  ) : undefined
  const theme = isPastOffer(item.tradeStatus) ? 'light' : undefined

  return isContractSummary(item) ? (
    <ContractItem key={item.id} contractSummary={item} {...{ tradeTheme, icon, theme }} />
  ) : (
    <OfferItem key={item.id} offerSummary={item} {...{ tradeTheme, icon, theme }} />
  )
}
