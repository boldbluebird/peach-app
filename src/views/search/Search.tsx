/* eslint-disable max-lines */
import messaging from '@react-native-firebase/messaging'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import {
  Pressable,
  View
} from 'react-native'

import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { BigTitle, Button, Headline, Icon, Loading, Matches, SatsFormat, Text } from '../../components'
import AddPaymentMethod from '../../components/inputs/paymentMethods/AddPaymentMethod'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import searchForPeersEffect from '../../effects/searchForPeersEffect'
import { OfferTaken } from '../../messageBanners/OfferTaken'
import { PaymentDataMissing } from '../../messageBanners/PaymentDataMissing'
import ConfirmCancelOffer from '../../overlays/ConfirmCancelOffer'
import DifferentCurrencyWarning from '../../overlays/DifferentCurrencyWarning'
import DoubleMatch from '../../overlays/info/DoubleMatch'
import Match from '../../overlays/info/Match'
import MatchAccepted from '../../overlays/MatchAccepted'
import { account, addPaymentData } from '../../utils/account'
import { unique } from '../../utils/array'
import { getRandom } from '../../utils/crypto'
import { error, info } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { saveOffer } from '../../utils/offer'
import { encryptPaymentData, hashPaymentData } from '../../utils/paymentMethod'
import { matchOffer, unmatchOffer } from '../../utils/peachAPI/private/offer'
import { signAndEncrypt } from '../../utils/pgp'
import { decryptSymmetricKey } from '../contract/helpers/parseContract'

const updaterPNs = [
  'offer.matchSeller',
  'contract.contractCreated',
]

type Props = {
  route: RouteProp<{ params: {
    offer: BuyOffer,
    hasMatches?: boolean,
  } }>,
  navigation: StackNavigation,
}
// eslint-disable-next-line max-lines-per-function, max-statements
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>()
  const [offer, setOffer] = useState<BuyOffer|SellOffer>(route.params.offer)
  const [offerId, setOfferId] = useState<string|undefined>(route.params.offer.id)
  const [updatePending, setUpdatePending] = useState(true)
  const [matchLoading, setMatchLoading] = useState(false)
  const [pnReceived, setPNReceived] = useState(0)

  const [matches, setMatches] = useState<Match[]>([])
  const [searchingMatches, setSearchingMatches] = useState(true)

  const [seenMatches, setSeenMatches] = useState<Offer['id'][]>(route.params.offer.seenMatches)
  const currentMatch = matches[currentMatchIndex]

  const saveAndUpdate = (offerData: BuyOffer|SellOffer) => {
    setOffer(offerData)
    setOfferId(offerData.id)
    saveOffer(offerData)
  }

  const setMatchingOptions = (match?: number|null, currency?: Currency|null, paymentMethod?: PaymentMethod|null) => {
    if (typeof match === 'number') {
      setCurrentMatchIndex(match)
      setSeenMatches(seen => {
        seen = (offer.seenMatches || []).concat([matches[match].offerId]).filter(unique())
        saveAndUpdate({
          ...offer,
          seenMatches: seen
        })
        return seen
      })

    }

    if (currency) setSelectedCurrency(currency)
    if (paymentMethod) setSelectedPaymentMethod(paymentMethod)
  }

  const onPaymentDataUpdate = async (newData: PaymentData) => {
    await addPaymentData(newData, false)
    updateOverlay({ content: null, showCloseButton: true })
  }
  const openAddPaymentMethodDialog = () => {
    if (!selectedPaymentMethod || !selectedCurrency) return
    updateMessage({ template: null, level: 'ERROR' })
    updateOverlay({
      content: <AddPaymentMethod
        paymentMethod={selectedPaymentMethod}
        currencies={[selectedCurrency]}
        onSubmit={onPaymentDataUpdate}
      />,
      showCloseButton: false
    })
  }

  // eslint-disable-next-line max-statements, max-lines-per-function
  const _match = async (match: Match) => {
    let encryptedSymmmetricKey
    let encryptedPaymentData

    if (!offer || !offer.id) return

    if (!selectedCurrency || !selectedPaymentMethod) {
      error(
        'Match data missing values.',
        `selectedCurrency: ${selectedCurrency}`,
        `selectedPaymentMethod: ${selectedPaymentMethod}`
      )
      return
    }

    if (!offer.meansOfPayment[selectedCurrency]
      || offer.meansOfPayment[selectedCurrency]!.indexOf(selectedPaymentMethod) === -1) {
      updateOverlay({
        content: <DifferentCurrencyWarning currency={selectedCurrency} paymentMethod={selectedPaymentMethod} />,
        showCloseButton: false,
        showCloseIcon: false
      })
    }

    setMatchLoading(true)

    if (offer.type === 'bid') {
      encryptedSymmmetricKey = await signAndEncrypt(
        (await getRandom(256)).toString('hex'),
        [account.pgp.publicKey, match.user.pgpPublicKey].join('\n')
      )
    } else if (offer.type === 'ask') {
      const [symmetricKey] = await decryptSymmetricKey(
        match.symmetricKeyEncrypted, match.symmetricKeySignature,
        match.user.pgpPublicKey
      )

      const paymentDataForMethod = account.paymentData.filter(data =>
        data.type === selectedPaymentMethod
      )
      let paymentDataHashes = paymentDataForMethod.map(data => hashPaymentData(data))
      let index = paymentDataHashes.indexOf(offer.paymentData[selectedPaymentMethod] || '')

      if (index === -1) { // TODO remove legacy support after 18th of July
        paymentDataHashes = paymentDataForMethod.map(data => hashPaymentData(data, true))
        index = paymentDataHashes.indexOf(offer.paymentData[selectedPaymentMethod] || '')
      }
      if (index === -1) {
        error('Payment data could not be found for offer', offer.id)
        updateMessage({
          template: <PaymentDataMissing openAddPaymentMethodDialog={openAddPaymentMethodDialog} />,
          level: 'ERROR',
        })
        return
      }

      encryptedPaymentData = await encryptPaymentData(
        paymentDataForMethod[index],
        symmetricKey
      )
    }

    const [result, err] = await matchOffer({
      offerId: offer.id, matchingOfferId: match.offerId,
      currency: selectedCurrency, paymentMethod: selectedPaymentMethod,
      symmetricKeyEncrypted: encryptedSymmmetricKey?.encrypted,
      symmetricKeySignature: encryptedSymmmetricKey?.signature,
      paymentDataEncrypted: encryptedPaymentData?.encrypted,
      paymentDataSignature: encryptedPaymentData?.signature,
      hashedPaymentData: offer.type === 'ask' ? offer.paymentData[selectedPaymentMethod] : undefined,
    })

    if (result) {
      setMatches(matches.map(m => {
        if (m.offerId !== match.offerId) return m
        m.matched = true
        if (result.matchedPrice) m.matchedPrice = result.matchedPrice
        return m
      }))

      if (offer.type === 'ask') {
        saveAndUpdate({
          ...offer,
          doubleMatched: true,
          contractId: result.contractId
        })

        if (result.contractId) {
          info('Search.tsx - _match', `navigate to contract ${result.contractId}`)
          navigation.replace('contract', { contractId: result.contractId })
        }
      }
    } else {
      error('Error', err)
      if (err?.error === 'NOT_FOUND') {
        updateMessage({
          template: <OfferTaken />,
          level: 'WARN',
        })
      } else {
        updateMessage({
          msg: i18n(err?.error || 'error.general', (err?.details as string[] || []).join(', ')),
          level: 'ERROR',
        })
      }
    }
    setMatchLoading(false)
  }

  const _unmatch = async (match: Match) => {
    if (!offer || !offer.id) return

    const [result, err] = await unmatchOffer({ offerId: offer.id, matchingOfferId: match.offerId })

    if (result) {
      setMatches(matches.map(m => ({
        ...m,
        matched: m.offerId === match.offerId ? !m.matched : m.matched
      })))
    } else {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }

  const _toggleMatch = () => currentMatch.matched ? _unmatch(currentMatch) : _match(currentMatch)

  // const _decline = () => {
  // alert('todo')
  // }

  const navigate = () => navigation.replace('yourTrades', {})

  const cancelOffer = () => updateOverlay({
    content: <ConfirmCancelOffer offer={offer} navigate={navigate} />,
    showCloseButton: false
  })

  const openMatchHelp = () => updateOverlay({
    content: offer.type === 'bid' ? <Match /> : <DoubleMatch />,
    showCloseButton: true, help: true
  })

  useFocusEffect(useCallback(() => {
    setOffer(route.params.offer)
    setOfferId(route.params.offer.id)
    if (offerId !== route.params.offer.id) setUpdatePending(true)
    setSearchingMatches(true)
  }, [route]))

  useEffect(() => {
    if (!offer.id || !matches.length) return

    const matchedOffers = matches.filter(m => m.matched).map(m => m.offerId)

    saveAndUpdate({
      ...offer,
      seenMatches,
      matched: matchedOffers
    })
  }, [matches])

  useFocusEffect(useCallback(getOfferDetailsEffect({
    offerId,
    interval: offer.type === 'bid' ? 30 * 1000 : 0,
    onSuccess: result => {

      saveAndUpdate({
        ...offer,
        ...result,
      })

      if (result.contractId) {
        info('Search.tsx - getOfferDetailsEffect', `navigate to contract ${result.contractId}`)
        navigation.replace('contract', { contractId: result.contractId })
      }

      setUpdatePending(() => false)
    },
    onError: err => {
      error('Could not fetch offer information for offer', offer.id)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [offerId, pnReceived]))

  useFocusEffect(useCallback(searchForPeersEffect({
    offer,
    onSuccess: result => {
      setSearchingMatches(false)
      setMatches(matches.concat(result)
        .filter(unique('offerId'))
        .filter((match, i) => {
          // don't mess with the current slide position by removing previous slides
          if (i < currentMatchIndex + 1) return true
          // otherwise, remove later slides if they are not present in results
          return result.some(m => m.offerId === match.offerId)
        })
        .map(match => {
          const update = result.find(m => m.offerId === match.offerId)
          match.prices = (update || match).prices
          return match
        })
      )
    },
    onError: err => err.error !== 'UNAUTHORIZED'
      ? updateMessage({ msg: i18n(err.error), level: 'ERROR' })
      : null,
  }), [updatePending, pnReceived]))

  useFocusEffect(useCallback(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null|void> => {
      if (!remoteMessage.data) return

      if (updaterPNs.indexOf(remoteMessage.data.type)) {
        setPNReceived(Math.random())
      }

      if (remoteMessage.data.type === 'contract.contractCreated' && remoteMessage.data.offerId !== offerId) {
        updateOverlay({
          content: <MatchAccepted contractId={remoteMessage.data.contractId} navigation={navigation} />,
        })
      }
    })

    return unsubscribe
  }, []))

  return <View style={tw`h-full flex-col justify-between pb-6 pt-5`}>
    <View style={tw`px-6`}>
      {!matches.length
        ? <BigTitle title={i18n(
          route.params.hasMatches
            ? 'search.matchesAreWaiting'
            : 'search.searchingForAPeer'
        )} />
        : <Headline style={[
          tw`text-center text-2xl leading-2xl uppercase text-peach-1`,
          tw.md`text-3xl leading-3xl`,
        ]}>
          {i18n(matches.length === 1 ? 'search.youGotAMatch' : 'search.youGotAMatches')}
        </Headline>
      }
      {searchingMatches
        ? <View style={tw`h-12`}>
          <Loading />
          <Text style={tw`text-center`}>{i18n('loading')}</Text>
        </View>
        : null
      }
      {!searchingMatches && !matches.length
        ? <Text style={tw`text-center mt-3`}>
          {i18n('search.weWillNotifyYou')}
        </Text>
        : null
      }
      {matches.length
        ? offer.type === 'bid'
          ? <View>
            <Text style={tw`text-grey-2 text-center -mt-1`}>
              {i18n('search.buyOffer')} <SatsFormat sats={offer.amount} color={tw`text-grey-2`} />
            </Text>
          </View>
          : <View>
            <Text style={tw`text-grey-2 text-center -mt-1`}>
              {i18n('search.sellOffer')} <SatsFormat sats={offer.amount} color={tw`text-grey-2`} />
            </Text>
            <Text style={tw`text-grey-2 text-center`}>
              {i18n(
                offer.premium > 0 ? 'search.atPremium' : 'search.atDiscount',
                String(Math.abs(offer.premium))
              )}
            </Text>
          </View>
        : null
      }
    </View>
    <View style={tw`h-full flex-shrink flex-col justify-end`}>
      {matches.length
        ? <View style={tw`h-full flex-shrink flex-col justify-end`}>
          <Matches offer={offer} matches={matches} navigation={navigation}
            onChange={setMatchingOptions} toggleMatch={_toggleMatch}/>
          {offer.type === 'bid'
            ? <View style={tw`flex-row items-center justify-center`}>
              <Button
                title={i18n(currentMatch?.matched ? 'search.waitingForSeller' : 'search.matchOffer')}
                wide={false}
                disabled={currentMatch?.matched || matchLoading}
                loading={matchLoading}
                onPress={_toggleMatch}
              />
              <Pressable onPress={openMatchHelp} style={tw`w-0 h-full flex-row items-center`}>
                <View style={tw`w-10 h-10 flex items-center justify-center`}>
                  <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
                </View>
              </Pressable>
            </View>
            : <View style={tw`flex-row items-center justify-center`}>
              {/* <Button
                title={i18n('search.declineMatch')}
                wide={false}
                secondary={true}
                disabled={currentMatch?.matched}
                onPress={_decline}
              /> */}
              <Button
                // style={tw`ml-6`}
                title={i18n('search.acceptMatch')}
                wide={false}
                disabled={currentMatch?.matched}
                onPress={() => _match(currentMatch)}
              />
              <Pressable onPress={openMatchHelp} style={tw`w-0 h-full flex-row items-center`}>
                <View style={tw`w-10 h-10 flex items-center justify-center`}>
                  <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
                </View>
              </Pressable>
            </View>
          }
        </View>
        : <View style={tw`flex items-center mt-6`}>
          <Button
            title={i18n('goBackHome')}
            wide={false}
            onPress={() => navigation.replace('home', {})}
          />
        </View>
      }
      <Pressable style={tw`mt-3`} onPress={cancelOffer}>
        <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>
          {i18n('cancelOffer')}
        </Text>
      </Pressable>
    </View>
  </View>
}
