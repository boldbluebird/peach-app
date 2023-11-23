import { API_URL } from '@env'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Header, Screen } from '../../components'
import { HeaderIcon } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Button } from '../../components/buttons/Button'
import { CurrencySelection } from '../../components/inputs/paymentMethods/paymentForms/components'
import { toggleCurrency } from '../../components/inputs/paymentMethods/paymentForms/utils'
// eslint-disable-next-line max-len
import { hasMultipleAvailableCurrencies } from '../../components/inputs/paymentMethods/paymentForms/utils/hasMultipleAvailableCurrencies'
import { useDeletePaymentMethod } from '../../components/payment/hooks/useDeletePaymentMethod'
import { useRoute, useShowHelp } from '../../hooks'
import { useGoToOrigin } from '../../hooks/useGoToOrigin'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import tw from '../../styles/tailwind'
import fetch from '../../utils/fetch'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { parseResponse } from '../../utils/peachAPI/parseResponse'
import { getPrivateHeaders } from '../../utils/peachAPI/private/getPrivateHeaders'
import { PaymentFieldTypes } from '../../utils/validation/rules'
import { FormInput } from './FormInput'
import { NewLabelInput } from './NewLabelInput'
import { TabbedFormNavigation } from './TabbedFormNavigation'

// todo: double check cbu, cvu. was called accountNumber before
// todo: add migration for new field names

export type FormType = Record<PaymentFieldTypes, string> & { paymentMethodName: string }

export const PaymentMethodForm = () => {
  const { paymentData, origin } = useRoute<'paymentMethodForm'>().params
  const goBackTo = useGoToOrigin()
  const selectPaymentMethod = useOfferPreferences((state) => state.selectPaymentMethod)
  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData)

  const { currencies, type: paymentMethod, id, country, label } = paymentData

  const fields = useFormFields(paymentMethod)

  const {
    control,
    handleSubmit,
    formState: { isValid },
    getFieldState,
    getValues,
  } = useForm({ mode: 'all' })
  // this could become part of the form
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)
  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const onValid = (data: FormType) => {
    const { paymentMethodName, ...rest } = data
    const test = {
      ...rest,
      id: id || `${paymentMethod}-${Date.now()}`,
      label: paymentMethodName,
      type: paymentMethod !== 'giftCard.amazon' ? paymentMethod : `${paymentMethod}.${country}`,
      currencies: selectedCurrencies,
    } satisfies PaymentData

    addPaymentData(test)
    selectPaymentMethod(test.id)
    goBackTo(origin)
  }

  return (
    <Screen header={<PaymentMethodFormHeader />}>
      {!!fields && (
        <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`gap-4 grow`}>
          <View style={tw`justify-center grow`}>
            <NewLabelInput name="paymentMethodName" control={control} id={id} defaultValue={label} />

            {fields.mandatory.map((row) => {
              if (row.length === 1) {
                const column = row[0]
                return column.map((field) => (
                  <FormInput
                    key={`formInput-${field}`}
                    name={field}
                    control={control}
                    defaultValue={paymentData[field]}
                  />
                ))
              }
              return (
                <TabbedFormNavigation
                  key={`tabbedFormNavigation-${row}`}
                  {...{ row, control, paymentData, getFieldState, getValues }}
                />
              )
            })}

            {fields.optional.map((field: PaymentFieldTypes) => (
              <FormInput
                key={`formInput-${field}`}
                name={field}
                control={control}
                defaultValue={paymentData[field]}
                optional
              />
            ))}

            {hasMultipleAvailableCurrencies(paymentMethod) && (
              <CurrencySelection
                paymentMethod={paymentMethod}
                onToggle={onCurrencyToggle}
                selectedCurrencies={selectedCurrencies}
              />
            )}
          </View>
          <Button style={tw`self-center`} disabled={!isValid} onPress={handleSubmit(onValid)}>
            {i18n('confirm')}
          </Button>
        </PeachScrollView>
      )}
    </Screen>
  )
}

function PaymentMethodFormHeader () {
  const {
    paymentData: { type: paymentMethod, id },
  } = useRoute<'paymentMethodForm'>().params
  const showHelp = useShowHelp('currencies')
  const showLNURLHelp = useShowHelp('lnurl')
  const deletePaymentMethod = useDeletePaymentMethod(id ?? '')

  const getHeaderIcons = useCallback(() => {
    const icons: HeaderIcon[] = []
    if (['revolut', 'wise', 'paypal', 'advcash'].includes(paymentMethod)) {
      icons[0] = { ...headerIcons.help, onPress: showHelp }
    }
    if (paymentMethod === 'lnurl') {
      icons[0] = { ...headerIcons.help, onPress: showLNURLHelp }
    }
    if (id) {
      icons[1] = { ...headerIcons.delete, onPress: deletePaymentMethod }
    }
    return icons
  }, [paymentMethod, id, showHelp, showLNURLHelp, deletePaymentMethod])

  return (
    <Header
      title={i18n(
        id ? 'paymentMethod.edit.title' : 'paymentMethod.select.title',
        i18n(`paymentMethod.${paymentMethod}`),
      )}
      icons={getHeaderIcons()}
    />
  )
}

function useFormFields (paymentMethod: PaymentMethod) {
  const queryData = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const [result, error] = await parseResponse(
        await fetch(`${API_URL}/v1/info/paymentMethods`, {
          headers: await getPrivateHeaders(),
          method: 'GET',
        }),
        'paymentMethods',
      )

      if (error) {
        throw error
      }

      // TODO: remove this type assertion
      return result as {
        id: PaymentMethod
        fields: {
          mandatory: PaymentFieldTypes[][][]
          optional: PaymentFieldTypes[]
        }
      }[]
    },
  })

  const method = queryData.data?.find(({ id }) => id === paymentMethod)
  const fields = method?.fields

  return fields
}
