import { groupChars, priceFormat } from '../../utils/string'
import { PeachText } from './Text'

type Props = ComponentProps & {
  amount: number
  currency: Currency
  round?: boolean
}

export const PriceFormat = ({ amount, currency, round, style }: Props) => (
  <PeachText style={style}>
    {currency === 'SAT' ? groupChars(amount.toFixed(), 3) : priceFormat(amount, round)} {currency}
  </PeachText>
)
