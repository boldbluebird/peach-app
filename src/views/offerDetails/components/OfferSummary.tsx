import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { PeachScrollView, PrimaryButton, SatsFormat, SellOfferSummary, Text, Title } from '../../../components'
import { useCancelOffer } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'
import { useOfferSummarySetup } from './useOfferSummarySetup'

type OfferSummaryProps = {
  offer: SellOffer
}

export default ({ offer }: OfferSummaryProps): ReactElement => {
  const { title, navigation } = useOfferSummarySetup(offer)
  const cancelOffer = useCancelOffer(offer)

  const goToOffer = () => {
    if (!offer.newOfferId) return
    navigation.replace('offer', { offerId: offer.newOfferId })
  }

  return (
    <PeachScrollView contentContainerStyle={tw`px-6 pt-5 pb-10`}>
      <View>
        <Title title={title} />
        {offer.tradeStatus !== 'offerCanceled' ? (
          <Text style={tw`-mt-1 text-center text-grey-2`}>
            {i18n('yourTrades.search.sell.subtitle')} <SatsFormat sats={offer.amount} color={tw`text-grey-2`} />
          </Text>
        ) : (
          <Text style={tw`-mt-1 text-center text-grey-2`}>{i18n('yourTrades.offerCanceled.subtitle')}</Text>
        )}
        {offer.newOfferId ? (
          <Text style={tw`leading-6 text-center text-grey-2`} onPress={goToOffer}>
            {i18n('yourTrades.offer.replaced', offerIdToHex(offer.newOfferId))}
          </Text>
        ) : null}
        {offer.tradeStatus !== 'offerCanceled' ? (
          <Text style={tw`mt-5 text-center text-black-1`}>{i18n('search.weWillNotifyYou')}</Text>
        ) : null}

        <View style={[tw`mt-7`, offer.tradeStatus === 'offerCanceled' ? tw`opacity-50` : {}]}>
          <SellOfferSummary offer={offer} />
        </View>
        <PrimaryButton style={tw`self-center mt-4`} onPress={() => navigation.navigate('yourTrades')} narrow>
          {i18n('back')}
        </PrimaryButton>
        {offer.tradeStatus !== 'offerCanceled' ? (
          <Pressable style={tw`mt-3`} onPress={cancelOffer}>
            {/* TODO use TextLink component and add bold mode */}
            <Text style={tw`text-sm text-center underline uppercase font-baloo text-peach-1`}>
              {i18n('cancelOffer')}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </PeachScrollView>
  )
}
