import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

type ItemProps = ComponentProps & {
  label: string
  isSelected: boolean
  onPress: () => void
}
export const CurrencyItem = ({ label, isSelected, onPress, style }: ItemProps): ReactElement => {
  const bgColor = isSelected ? tw`bg-primary-main` : {}
  const borderColor = isSelected ? tw`border-primary-main` : tw`border-black-3`
  const textColor = isSelected ? tw`text-primary-background-light` : tw`text-black-3`

  return (
    <Pressable
      onPress={onPress}
      style={[
        tw`flex-shrink flex-row justify-center items-center border border-black-3 rounded-lg`,
        bgColor,
        borderColor,
        style,
      ]}
    >
      <Text style={[tw`button-medium px-2`, textColor]}>{label}</Text>
      <Icon id={isSelected ? 'minusCircle' : 'plusCircle'} color={textColor.color} style={tw`w-3 h-3 mr-2`} />
    </Pressable>
  )
}
