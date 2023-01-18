import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { useFocusEffect } from '@react-navigation/native'
import { GoBackButton, PrimaryButton, Title } from '../../components'
import ProvideRefundAddress from '../../overlays/info/ProvideRefundAddress'
import i18n from '../../utils/i18n'
import ReturnAddress from './components/ReturnAddress'
import { saveOffer } from '../../utils/offer'
import { patchOffer } from '../../utils/peachAPI'
import { error } from '../../utils/log'
import { MessageContext } from '../../contexts/message'
import { useNavigation, useRoute } from '../../hooks'
import { useMatchStore } from '../../components/matches/store'

export default (): ReactElement => {
  const route = useRoute<'setReturnAddress'>()
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const [offer, setOffer] = useState<SellOffer>(route.params.offer)
  const [returnAddress, setReturnAddress] = useState(route.params.offer.returnAddress)

  useFocusEffect(
    useCallback(() => {
      setOffer(route.params.offer)
      setReturnAddress(route.params.offer.returnAddress)
    }, [route]),
  )

  const submit = async () => {
    const [patchOfferResult, patchOfferError] = await patchOffer({
      offerId: offer.id,
      returnAddress,
    })
    if (patchOfferResult) {
      const patchedOffer = {
        ...offer,
        returnAddress,
        returnAddressRequired: false,
      }
      saveOffer(patchedOffer)
      if (offer.online) {
        matchStoreSetOffer(patchedOffer)
        navigation.navigate('search')
        return
      }
      navigation.navigate('fundEscrow', { offer: patchedOffer })
    } else if (patchOfferError) {
      error('Error', patchOfferError)
      updateMessage({
        msgKey: patchOfferError?.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
    }
  }

  return (
    <View style={tw`flex items-stretch h-full px-6 pt-6 pb-10`}>
      <Title
        title={i18n('sell.title')}
        subtitle={i18n('offer.requiredAction.provideReturnAddress')}
        help={<ProvideRefundAddress />}
      />
      <View style={tw`flex-shrink h-full mt-12`}>
        <ReturnAddress style={tw`mt-16`} returnAddress={returnAddress} required update={setReturnAddress} />
      </View>
      <View style={tw`flex items-center mt-16`}>
        <PrimaryButton style={tw`w-52`} disabled={!returnAddress} onPress={submit} narrow>
          {i18n(!returnAddress ? 'sell.setReturnAddress.provideFirst' : 'confirm')}
        </PrimaryButton>
        <GoBackButton style={tw`mt-2 w-52`} />
      </View>
    </View>
  )
}
