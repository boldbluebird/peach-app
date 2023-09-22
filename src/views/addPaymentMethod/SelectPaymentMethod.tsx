import { useMemo, useState } from 'react'
import { useDrawerContext } from '../../contexts/drawer'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import { FlagType } from '../../components/flags'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import { NATIONALOPTIONCOUNTRIES, NATIONALOPTIONS, PAYMENTCATEGORIES } from '../../paymentMethods'
import { getApplicablePaymentCategories, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'
import { usePaymentMethodLabel } from './hooks'
import { getCurrencyTypeFilter } from './utils'

const mapCountryToDrawerOption = (onPress: (country: FlagType) => void) => (country: FlagType) => ({
  title: i18n(`country.${country}`),
  flagID: country,
  onPress: () => onPress(country),
})

export const SelectPaymentMethod = () => {
  useHeaderSetup(i18n('selectPaymentMethod.title'))

  const navigation = useNavigation()
  const { selectedCurrency, origin } = useRoute<'selectPaymentMethod'>().params
  const [, updateDrawer] = useDrawerContext()

  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<PaymentCategory>()
  const paymentCategories = useMemo(
    () =>
      getApplicablePaymentCategories(selectedCurrency).map((c) => ({
        value: c,
        display: i18n(`paymentCategory.${c}`),
      })),
    [selectedCurrency],
  )

  const getPaymentMethodLabel = usePaymentMethodLabel()

  const goToPaymentMethodForm = (paymentMethod: PaymentMethod) => {
    const label = getPaymentMethodLabel(paymentMethod)
    navigation.navigate('paymentMethodForm', {
      paymentData: { type: paymentMethod, label, currencies: [selectedCurrency] },
      origin,
    })
  }

  const unselectCategory = () => setSelectedPaymentCategory(undefined)

  const selectPaymentMethod = (paymentMethod: PaymentMethod) => {
    unselectCategory()
    updateDrawer({ show: false })

    if (paymentMethod === 'giftCard.amazon') {
      navigation.navigate('selectCountry', { selectedCurrency, origin })
    } else {
      goToPaymentMethodForm(paymentMethod)
    }
  }

  const mapMethodToDrawerOption = (method: PaymentMethod) => ({
    title: i18n(`paymentMethod.${method}`),
    logoID: method,
    onPress: () => selectPaymentMethod(method),
  })

  const getDrawerConfig = (category: PaymentCategory) => ({
    title: i18n(`paymentCategory.${category}`),
    show: true,
    onClose: unselectCategory,
  })

  const getNationalOptions = () => {
    if (getCurrencyTypeFilter('europe')(selectedCurrency)) {
      return NATIONALOPTIONS.EUR
    }
    return NATIONALOPTIONS.LATAM
  }

  const getNationalOptionCountries = () => {
    if (getCurrencyTypeFilter('europe')(selectedCurrency)) {
      return NATIONALOPTIONCOUNTRIES.EUR
    }
    return NATIONALOPTIONCOUNTRIES.LATAM
  }

  const selectCountry = (country: FlagType, category: PaymentCategory) => {
    const nationalOptions = getNationalOptions()[country]
    const nationalOptionCountries = getNationalOptionCountries()
    updateDrawer({
      title: i18n(`country.${country}`),
      options: nationalOptions.map(mapMethodToDrawerOption),
      previousDrawer: {
        options: nationalOptionCountries.map(mapCountryToDrawerOption((cntry) => selectCountry(cntry, category))),
        ...getDrawerConfig(category),
      },
      show: true,
      onClose: unselectCategory,
    })
  }

  const getDrawerOptions = (category: PaymentCategory) =>
    category === 'nationalOption'
      ? getNationalOptionCountries().map(mapCountryToDrawerOption((country) => selectCountry(country, category)))
      : PAYMENTCATEGORIES[category]
        .filter((method) => paymentMethodAllowedForCurrency(method, selectedCurrency))
        .filter((method) => category !== 'giftCard' || method === 'giftCard.amazon')
        .map(mapMethodToDrawerOption)

  const showDrawer = (category: PaymentCategory) => {
    updateDrawer({
      options: getDrawerOptions(category),
      ...getDrawerConfig(category),
    })
  }

  const selectPaymentCategory = (category: PaymentCategory) => {
    setSelectedPaymentCategory(category)
    showDrawer(category)
  }

  return (
    <Screen>
      <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-4`, tw.md`py-8`]}>
        <RadioButtons
          items={paymentCategories}
          selectedValue={selectedPaymentCategory}
          onButtonPress={selectPaymentCategory}
        />
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mt-2 mb-5`} disabled={!selectedPaymentCategory} narrow>
        {i18n('next')}
      </PrimaryButton>
    </Screen>
  )
}
