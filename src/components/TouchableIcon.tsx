import { ColorValue, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Icon } from '.'
import { IconType } from '../assets/icons'
import tw from '../styles/tailwind'

type Props = {
  id: IconType
  iconColor?: ColorValue | undefined
  iconSize?: number
} & TouchableOpacityProps

export function TouchableIcon ({ id, iconColor = tw`text-primary-main`.color, iconSize, ...touchableProps }: Props) {
  return (
    <TouchableOpacity {...touchableProps}>
      <Icon id={id} size={iconSize ?? 24} color={iconColor} />
    </TouchableOpacity>
  )
}
