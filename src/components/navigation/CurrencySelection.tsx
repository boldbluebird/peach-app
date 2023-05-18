import { Pressable, View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'

type CurrencySelectionItemProps = ComponentProps & {
  currency: Currency
  isSelected: boolean
  onPress: (currency: Currency) => void
}
const CurrencySelectionItem = ({ currency, isSelected, onPress, style }: CurrencySelectionItemProps) => (
  <Pressable style={style} onPress={() => onPress(currency)}>
    <Text numberOfLines={1} style={[tw`button-large text-center text-black-2`, isSelected && tw`text-black-1`]}>
      {currency}
    </Text>
    {isSelected && <View style={[tw`w-full h-0.5 -mt-0.5 bg-black-1 rounded-1px`]} />}
  </Pressable>
)

const ItemSeparator = ({ style }: ComponentProps) => <View style={[tw`w-px h-4 bg-black-6`, style]} />

type Props = ComponentProps & {
  currencies: Currency[]
  selected: Currency
  select: (currency: Currency) => void
}

export const CurrencySelection = ({ currencies, selected, select, style }: Props) => {
  const maxColumns = Math.max(4, Math.min(currencies.length, 8))
  const maxWidth = (1 / maxColumns) * 100 - 0.001 + '%'
export const CurrencySelection = ({ currencies, selected, select, style }: Props) => (
  <View style={[tw`flex-row flex-wrap`, currencies.length > 8 && tw`justify-center`, style]}>
    {currencies.map((currency, index) => (
      <View
        style={[tw`flex-row min-w-[12.5%] max-w-[25%] flex-grow items-center`]}
        key={'currency-selection-' + currency}
      >
        <CurrencySelectionItem
          currency={currency}
          isSelected={currency === selected}
          onPress={select}
          style={tw`flex-grow`}
        />
        {index < currencies.length - 1 && (
          <ItemSeparator key={'currency-selection-separator' + currency} style={tw`mx-1`} />
        )}
      </View>
    ))}
  </View>
)
