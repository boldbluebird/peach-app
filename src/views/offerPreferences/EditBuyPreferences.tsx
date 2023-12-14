/* eslint-disable max-lines */
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useReducer, useState } from 'react'
import { Button } from '../../components/buttons/Button'
import { MeansOfPayment } from '../../components/offer/MeansOfPayment'
import { useNavigation, useRoute } from '../../hooks'
import { usePatchOffer } from '../../hooks/offer'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import { interpolate } from '../../utils/math/interpolate'
import { hasMopsConfigured } from '../../utils/offer/hasMopsConfigured'
import { isBuyOffer } from '../../utils/offer/isBuyOffer'
import { LoadingScreen } from '../loading/LoadingScreen'
import { matchesKeys } from '../search/hooks/useOfferMatches'
import { AmountSelectorComponent } from './components/AmountSelectorComponent'
import { BuyBitcoinHeader } from './components/BuyBitcoinHeader'
import { FilterContainer } from './components/FilterContainer'
import { MarketInfo } from './components/MarketInfo'
import { MaxPremiumFilterComponent } from './components/MaxPremiumFilterComponent'
import { ReputationFilterComponent } from './components/MinReputationFilter'
import { PreferenceScreen } from './components/PreferenceScreen'
import { Section } from './components/Section'
import { useTradingAmountLimits } from './utils/useTradingAmountLimits'

type Preferences = Pick<BuyOffer, 'amount' | 'maxPremium' | 'minReputation' | 'meansOfPayment'>

type PreferenceAction =
  | { type: 'amount_changed'; amount: BuyOffer['amount'] }
  | { type: 'premium_changed'; premium: BuyOffer['maxPremium'] }
  | { type: 'reputation_toggled' }
  | { type: 'max_premium_toggled' }
const PreferenceContext = createContext<[Preferences, React.Dispatch<PreferenceAction>] | null>(null)
const usePreferenceContext = () => {
  const context = useContext(PreferenceContext)
  if (!context) {
    throw new Error('usePreferenceContext must be used within a PreferenceContextProvider')
  }
  return context
}

function offerReducer (state: Preferences, action: PreferenceAction) {
  switch (action.type) {
  case 'amount_changed': {
    return { ...state, amount: action.amount }
  }
  case 'premium_changed': {
    return { ...state, maxPremium: action.premium }
  }
  case 'reputation_toggled': {
    return { ...state, minReputation: state.minReputation === 4.5 ? null : 4.5 }
  }
  case 'max_premium_toggled': {
    return { ...state, maxPremium: state.maxPremium === null ? 0 : null }
  }
  default: {
    return state
  }
  }
}

export function EditBuyPreferences () {
  const { offerId } = useRoute<'editBuyPreferences'>().params
  const { offer, isLoading } = useOfferDetails(offerId)

  if (isLoading || !offer) return <LoadingScreen />
  if (!isBuyOffer(offer)) throw new Error('Offer is not a buy offer')

  return <ScreenContent offer={offer} />
}

function initializer (offer: BuyOffer) {
  const minReputation
    = typeof offer?.minReputation === 'number' ? interpolate(offer.minReputation, [-1, 1], [0, 5]) : null
  const maxPremium = offer?.maxPremium ?? null
  const { amount, meansOfPayment } = offer
  return { amount, meansOfPayment, minReputation, maxPremium }
}

function ScreenContent ({ offer }: { offer: BuyOffer }) {
  const [isSliding, setIsSliding] = useState(false)
  const reducer = useReducer(offerReducer, offer, initializer)
  return (
    <PreferenceContext.Provider value={reducer}>
      <PreferenceScreen header={<BuyBitcoinHeader />} isSliding={isSliding} button={<ShowOffersButton />}>
        <OfferMarketInfo />
        <OfferMethods />
        <AmountSelector setIsSliding={setIsSliding} />
        <Filters />
      </PreferenceScreen>
    </PreferenceContext.Provider>
  )
}

function OfferMarketInfo () {
  const [{ amount, maxPremium, minReputation, meansOfPayment }] = usePreferenceContext()
  return (
    <MarketInfo
      type={'sellOffers'}
      meansOfPayment={meansOfPayment}
      maxPremium={maxPremium || undefined}
      minReputation={minReputation || undefined}
      buyAmountRange={amount}
    />
  )
}

function OfferMethods () {
  const [{ meansOfPayment }] = usePreferenceContext()
  const hasSelectedMethods = hasMopsConfigured(meansOfPayment)
  const backgroundColor = tw.color('success-mild-1')
  return (
    <Section.Container style={{ backgroundColor }}>
      {hasSelectedMethods ? (
        <MeansOfPayment meansOfPayment={meansOfPayment} style={tw`flex-1`} />
      ) : (
        <Section.Title>all payment methods</Section.Title>
      )}
    </Section.Container>
  )
}

function AmountSelector ({ setIsSliding }: { setIsSliding: (isSliding: boolean) => void }) {
  const [offer, dispatch] = usePreferenceContext()
  const offerRange = offer?.amount || ([0, 0] satisfies [number, number])

  function handleAmountChange (newAmount: [number, number]) {
    dispatch({
      type: 'amount_changed',
      amount: newAmount,
    })
  }

  return <AmountSelectorComponent setIsSliding={setIsSliding} range={offerRange} setRange={handleAmountChange} />
}

function Filters () {
  return (
    <FilterContainer
      filters={
        <>
          <MaxPremiumFilter />
          <ReputationFilter />
        </>
      }
    />
  )
}

function ReputationFilter () {
  const [{ minReputation }, dispatch] = usePreferenceContext()

  function handleToggle () {
    dispatch({
      type: 'reputation_toggled',
    })
  }

  return <ReputationFilterComponent minReputation={minReputation} toggle={handleToggle} />
}

function MaxPremiumFilter () {
  const [offer, dispatch] = usePreferenceContext()
  const maxPremium = offer?.maxPremium ?? null

  function handlePremiumChange (newPremium: number) {
    dispatch({
      type: 'premium_changed',
      premium: newPremium,
    })
  }

  function handleToggle () {
    dispatch({
      type: 'max_premium_toggled',
    })
  }

  return (
    <MaxPremiumFilterComponent
      maxPremium={maxPremium}
      setMaxPremium={handlePremiumChange}
      shouldApplyFilter={maxPremium !== null}
      toggleShouldApplyFilter={handleToggle}
    />
  )
}

function ShowOffersButton () {
  const [preferences] = usePreferenceContext()
  const { maxPremium } = preferences
  const minReputation = interpolate(preferences.minReputation || 0, [0, 5], [-1, 1])

  const { offerId } = useRoute<'editBuyPreferences'>().params
  const { offer } = useOfferDetails(offerId)
  if (offer && !isBuyOffer(offer)) throw new Error('Offer is not a buy offer')

  const rangeHasChanged = offer?.amount[0] !== preferences.amount[0] || offer?.amount[1] !== preferences.amount[1]
  const [min, max] = useTradingAmountLimits('buy')
  const rangeIsWithinLimits = preferences.amount[0] >= min && preferences.amount[1] <= max

  const rangeIsValid = preferences.amount[0] <= preferences.amount[1] && (!rangeHasChanged || rangeIsWithinLimits)
  const amount = rangeHasChanged ? preferences.amount : undefined
  const formValid = rangeIsValid

  const { mutate: patchOffer, isLoading: isPatching } = usePatchOffer()
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const onPress = () => {
    const newData = { maxPremium, minReputation, amount }
    patchOffer(
      { offerId, newData },
      {
        onSuccess: () => navigation.goBack(),
        onSettled: () => queryClient.invalidateQueries({ queryKey: matchesKeys.matchesByOfferId(offerId) }),
      },
    )
  }
  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={!formValid}
      loading={isPatching}
    >
      Show Offers
    </Button>
  )
}
