import React from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../../styles/tailwind'
import { dropShadowRed } from '../../../utils/layout'
import Icon from '../../Icon'
import { Shadow } from '../../ui'
import { useUnmatchOffer } from '../hooks'
import { useMatchStore } from '../store'

export const UnmatchButton = ({ match }: { match: Match }) => {
  const offer = useMatchStore((state) => state.offer)
  const { mutate: unmatch } = useUnmatchOffer(offer, match.offerId)
  return (
    <Pressable onPress={() => unmatch()} style={tw`absolute top-0 right-0 z-10 p-2`}>
      <Shadow shadow={dropShadowRed} style={tw`rounded-full`}>
        <View style={tw`bg-white-1 rounded-full p-0.5`}>
          <Icon id="undo" style={tw`w-4 h-4`} color={tw`text-grey-2`.color} />
        </View>
      </Shadow>
    </Pressable>
  )
}
