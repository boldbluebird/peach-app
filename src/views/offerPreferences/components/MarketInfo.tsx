import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { SectionContainer } from './SectionContainer'

export function MarketInfo ({ type = 'buyOffers' }: { type?: 'buyOffers' | 'sellOffers' }) {
  const text = type === 'buyOffers' ? 'buy offers' : 'sell offers'
  const textStyle = type === 'buyOffers' ? tw`text-success-main` : tw`text-primary-main`
  const openOffers = 0
  return (
    <SectionContainer style={tw`gap-0`}>
      <View style={tw`-gap-13px`}>
        <Text style={[tw`h5`, textStyle]}>
          {openOffers} {text}
        </Text>
        <Text style={[tw`subtitle-2`, textStyle]}>for your preferences</Text>
      </View>
      {type === 'sellOffers' && <AveragePremium />}
    </SectionContainer>
  )
}

function AveragePremium () {
  const premium = 5
  return <Text style={tw`body-s text-primary-main`}>average premium: ~{premium}%</Text>
}
