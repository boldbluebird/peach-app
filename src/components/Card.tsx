
import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'
import { mildShadow } from '../utils/layout'

import { Shadow } from '.'

type CardProps = ComponentProps

/**
 * @description Component to display a Card component
 * @param children child nodes
 * @param [props.style] additional styles to apply to the component
 * @example
 * <Card>
 *  <Text>This is a card</Text>
 * </Card>
 */
export const Card = ({ children, style }: CardProps): ReactElement =>
  <Shadow shadow={mildShadow}>
    <View style={[
      tw`w-full border border-grey-4 rounded bg-white-1`,
      style
    ]}>
      {children}
    </View>
  </Shadow>

export default Card