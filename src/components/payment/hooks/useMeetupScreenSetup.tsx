import { useState } from 'react'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useRoute } from '../../../hooks/useRoute'
import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { useAccountStore } from '../../../utils/account/account'
import { getPaymentMethodInfo } from '../../../utils/paymentMethod/getPaymentMethodInfo'
import { toggleCurrency } from '../../inputs/paymentForms/utils'

export const useMeetupScreenSetup = () => {
  const route = useRoute<'meetupScreen'>()
  const { eventId } = route.params
  const deletable = route.params.deletable ?? false
  const goToOrigin = useGoToOrigin()
  const getMeetupEvent = useMeetupEventsStore((state) => state.getMeetupEvent)
  const publicKey = useAccountStore((state) => state.account.publicKey)
  const event: MeetupEvent = getMeetupEvent(eventId) || {
    id: eventId,
    longName: '',
    shortName: '',
    currencies: [],
    country: 'DE',
    city: '',
    featured: false,
  }

  const [selectedCurrencies, setSelectedCurrencies] = useState(event.currencies)
  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData)

  const selectPaymentMethod = useOfferPreferences((state) => state.selectPaymentMethod)

  const addToPaymentMethods = () => {
    const meetupInfo = getPaymentMethodInfo(`cash.${event.id}`)
    if (!meetupInfo) return
    const meetup: PaymentData = {
      id: meetupInfo.id,
      label: event.shortName,
      type: meetupInfo.id,
      userId: publicKey,
      currencies: selectedCurrencies,
      country: event.country,
    }
    addPaymentData(meetup)
    selectPaymentMethod(meetupInfo.id)
    goToOrigin(route.params.origin)
  }

  return {
    paymentMethod: `cash.${event.id}` satisfies PaymentMethod,
    event,
    deletable,
    addToPaymentMethods,
    selectedCurrencies,
    onCurrencyToggle,
  }
}
