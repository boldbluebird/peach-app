import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Icon } from '../'

export type CheckboxItemType = {
  value: string | number
  disabled?: boolean
  display: ReactNode
}

type CheckboxItemProps = ComponentProps & {
  onPress: () => void
  item: CheckboxItemType
  checked: boolean
}
export const CheckboxItem = ({ item, checked, onPress, style, testID }: CheckboxItemProps): ReactElement => (
  <Pressable
    testID={testID}
    onPress={onPress}
    style={[
      tw`w-full flex-row justify-between items-center px-3 py-2 bg-primary-background-heavy rounded-xl border-2`,
      checked && !item.disabled ? tw`border-primary-main` : tw`border-transparent`,
      style,
    ]}
  >
    {item.display}
    {!item.disabled ? (
      <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
        {checked ? (
          <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
        ) : (
          <View style={tw`w-4 h-4 rounded-sm border-2 border-black-3`} />
        )}
      </View>
    ) : (
      <View style={tw`w-5 h-5 ml-4`} />
    )}
  </Pressable>
)

type CheckboxesProps = ComponentProps & {
  items: CheckboxItemType[]
  selectedValues?: (string | number)[]
  onChange?: (values: (string | number)[]) => void
}

/**
 * @description Component to display checkboxes
 * @example
 * <Checkboxes
    items={currencies.map(value => ({
      value,
      display: [
        <Text>{i18n(`currency.${value}`)} </Text>,
        <Text style={tw`text-grey-1`}>({value})</Text>
      ]
    }))}
    selectedValues={selectedCurrencies}
    onChange={(values) => setSelectedCurrencies(values)}/>
 */
export const Checkboxes = ({ items, selectedValues = [], onChange, style, testID }: CheckboxesProps): ReactElement => {
  const select = (value: string | number) => {
    let newValues = Array.from(selectedValues)
    if (newValues.includes(value)) {
      newValues = newValues.filter((v) => v !== value)
    } else {
      newValues.push(value)
    }

    if (onChange) onChange(newValues)
  }

  const isSelected = (itm: CheckboxItemType) => selectedValues.includes(itm.value)

  return (
    <View testID={`checkboxes-${testID}`} style={style}>
      {items.map((item, i) => (
        <CheckboxItem
          style={i > 0 ? tw`mt-2` : {}}
          testID={`${testID}-checkbox-${item.value}`}
          onPress={() => select(item.value)}
          key={i}
          item={item}
          checked={isSelected(item)}
        />
      ))}
    </View>
  )
}

export default Checkboxes
