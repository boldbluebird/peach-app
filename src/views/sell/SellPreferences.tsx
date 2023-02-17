import React, { Dispatch, ReactElement, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import { BackHandler, ScrollView, View } from 'react-native'
import shallow from 'zustand/shallow'
import tw from '../../styles/tailwind'

import OfferDetails from './OfferDetails'
import Summary from './Summary'

import { BitcoinPriceStats, HorizontalLine, Loading, Navigation, PeachScrollView } from '../../components'
import { MessageContext } from '../../contexts/message'
import { useNavigation } from '../../hooks'
import pgp from '../../init/pgp'
import { useSettingsStore } from '../../store/settingsStore'
import { updateTradingLimit } from '../../utils/account'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { saveOffer } from '../../utils/offer'
import { getTradingLimit, postSellOffer } from '../../utils/peachAPI'
import { getDefaultSellOffer } from './helpers/getDefaultSellOffer'
import Premium from './Premium'

export type SellViewProps = {
  offer: SellOfferDraft
  updateOffer: (offer: SellOfferDraft) => void
  setStepValid: Dispatch<SetStateAction<boolean>>
}

type Screen = null | (({ offer, updateOffer }: SellViewProps) => ReactElement)

const screens = [
  {
    id: 'premium',
    view: Premium,
    scrollable: true,
    showPrice: true,
  },
  {
    id: 'offerDetails',
    view: OfferDetails,
    scrollable: true,
    showPrice: false,
  },
  {
    id: 'summary',
    view: Summary,
    scrollable: true,
    showPrice: false,
  },
]

export default (): ReactElement => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const partialSettings = useSettingsStore(
    (state) => ({
      sellAmount: state.sellAmount,
      premium: state.premium,
      meansOfPayment: state.meansOfPayment,
      payoutAddress: state.payoutAddress,
      kyc: state.kyc,
      kycType: state.kycType,
    }),
    shallow,
  )
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )

  const [offer, setOffer] = useState(getDefaultSellOffer(partialSettings))
  const [stepValid, setStepValid] = useState(false)
  const [updatePending, setUpdatePending] = useState(false)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  let scroll = useRef<ScrollView>(null).current

  const saveAndUpdate = (offerData: SellOffer, shield = true) => {
    setOffer(offerData)
    if (offerData.id) saveOffer(offerData, undefined, shield)
  }

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (page === 0) {
        return false
      }
      setPage(page - 1)
      return true
    })
    return () => {
      listener.remove()
    }
  }, [page])

  const back = () => {
    if (page === 0) {
      navigation.goBack()
      return
    }
    setPage(page - 1)
    info('page -> ' + page)
    scroll?.scrollTo({ x: 0 })
  }

  const next = async () => {
    if (page === 1) {
      // summary screen (pages should be refactored into single views)
      if (!peachWalletActive && !payoutAddress && !payoutAddressLabel) {
        setPeachWalletActive(true)
      }
    }
    if (page >= screens.length - 1) {
      setUpdatePending(true)
      info('Posting offer ', JSON.stringify(offer))

      await pgp() // make sure pgp has been sent

      const [result, err] = await postSellOffer({
        type: offer.type,
        amount: offer.amount,
        premium: offer.premium,
        meansOfPayment: offer.meansOfPayment,
        paymentData: offer.paymentData,
        returnAddress: offer.returnAddress,
      })
      if (result) {
        info('Posted offer', result)

        getTradingLimit({}).then(([tradingLimit]) => {
          if (tradingLimit) {
            updateTradingLimit(tradingLimit)
          }
        })

        saveAndUpdate({ ...offer, id: result.offerId } as SellOffer)
        navigation.replace('fundEscrow', { offer: { ...offer, id: result.offerId } as SellOffer })
      } else if (err) {
        error('Error', err)
        updateMessage({
          msgKey: i18n(err?.error || 'POST_OFFER_ERROR', ((err?.details as string[]) || []).join(', ')),
          level: 'ERROR',
          action: {
            callback: () => navigation.navigate('contact'),
            label: i18n('contactUs'),
            icon: 'mail',
          },
        })
        back()
      }
      setUpdatePending(false)
      return
    }
    setPage(page + 1)

    scroll?.scrollTo({ x: 0 })
  }

  return (
    <View testID="view-sell" style={tw`flex-1`}>
      {updatePending ? (
        <View style={tw`absolute items-center justify-center w-full h-full`}>
          <Loading />
        </View>
      ) : (
        <>
          {currentScreen.showPrice && (
            <View style={tw`px-8`}>
              <HorizontalLine style={tw`mb-2`} />
              <BitcoinPriceStats />
            </View>
          )}
          <PeachScrollView
            scrollRef={(ref) => (scroll = ref)}
            disable={!scrollable}
            contentContainerStyle={[tw`items-center justify-center flex-grow p-5 pb-30`]}
          >
            {CurrentView && <CurrentView updateOffer={setOffer} {...{ offer, setStepValid }} />}
          </PeachScrollView>

          <Navigation screen={currentScreen.id} {...{ next, stepValid }} />
        </>
      )}
    </View>
  )
}
