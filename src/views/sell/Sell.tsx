import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import {
  Pressable,
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import BitcoinContext from '../../components/bitcoin'
import i18n from '../../utils/i18n'
import Main from './Main'
import OfferDetails from './OfferDetails'
import Summary from './Summary'
import Escrow from './Escrow'
import { BUCKETMAP, BUCKETS } from '../../constants'
import { postOffer } from '../../utils/peachAPI'
import { saveOffer } from '../../utils/accountUtils'
import { RouteProp, useIsFocused } from '@react-navigation/native'
import { MessageContext } from '../../utils/messageUtils'
import { error } from '../../utils/logUtils'
import { sha256 } from '../../utils/cryptoUtils'
import Navigation from './components/Navigation'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'sell'>

type Props = {
  route: RouteProp<{ params: {
    offer?: SellOffer,
    page?: number,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

export type SellViewProps = {
  offer: SellOffer,
  updateOffer: (data: SellOffer) => void,
  setStepValid: (isValid: boolean) => void,
}

export const defaultSellOffer: SellOffer = {
  type: 'ask',
  premium: 1.5,
  currencies: [],
  paymentData: [],
  hashedPaymentData: '',
  amount: BUCKETS[0],
  kyc: false
}
type Screen = ({ offer, updateOffer }: SellViewProps) => ReactElement

const screens = [
  {
    id: 'main',
    view: Main,
    scrollable: false
  },
  {
    id: 'offerDetails',
    view: OfferDetails,
    scrollable: true
  },
  {
    id: 'summary',
    view: Summary,
    scrollable: false
  },
  {
    id: 'escrow',
    view: Escrow,
    scrollable: false
  },
]


// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)
  const [, updateMessage] = useContext(MessageContext)
  const isFocused = useIsFocused()

  const [offer, setOffer] = useState<SellOffer>(defaultSellOffer)
  const [stepValid, setStepValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  useEffect(() => {
    if (!isFocused) return

    setOffer(() => route.params?.offer || defaultSellOffer)
    setPage(() => {
      const offr = route.params?.offer || defaultSellOffer
      const p = route.params?.page
        || offr.offerId ? screens.findIndex(s => s.id === 'escrow') : 0
      return p
    })
  }, [isFocused])

  const next = async (): Promise<void> => {
    if (screens[page + 1].id === 'escrow') {
      const hashedPaymentData = sha256(JSON.stringify(offer.paymentData))

      setLoading(true)
      const [result, err] = await postOffer({
        ...offer,
        amount: BUCKETMAP[String(offer.amount)],
        paymentMethods: offer.paymentData.map(p => p.type),
        hashedPaymentData,
      })

      if (result) {
        saveOffer({ ...offer, offerId: result.offerId })
        setOffer(() => ({ ...offer, offerId: result.offerId }))
      } else {
        error('Error', err)
        updateMessage({
          msg: i18n(err?.error || 'error.postOffer'),
          level: 'ERROR',
        })
        setLoading(false)
        return
      }
    }
    if (page >= screens.length - 1) return
    setPage(page + 1)

    scroll.current?.scrollTo({ x: 0 })
  }
  const back = () => {
    if (page === 0) return
    setPage(page - 1)
    scroll.current?.scrollTo({ x: 0 })
  }

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <ScrollView ref={scroll} style={tw`pt-6 overflow-visible`}>
        <View style={tw`pb-8`}>
          {CurrentView
            ? <CurrentView offer={offer} updateOffer={setOffer} setStepValid={setStepValid} />
            : null
          }
        </View>
        {scrollable
          ? <Navigation
            screen={currentScreen.id}
            back={back} next={next}
            loading={loading} stepValid={stepValid} />
          : null
        }
      </ScrollView>
    </View>
    {!scrollable
      ? <Navigation
        screen={currentScreen.id}
        back={back} next={next}
        loading={loading} stepValid={stepValid} />
      : null
    }
  </View>
}
