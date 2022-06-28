import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const SEPA = ({ forwardRef, view, data, onSubmit, onChange }: PaymentMethodFormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [iban, setIBAN] = useState(data?.iban || '')
  const [bic, setBIC] = useState(data?.bic || '')
  const [address, setAddress] = useState(data?.address || '')
  const [reference, setReference] = useState(data?.reference || '')
  const [currencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $address = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, beneficiary, iban, bic, address, reference },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & SEPAData => ({
    id: data?.id || `sepa-${new Date().getTime()}`,
    label,
    type: 'sepa',
    beneficiary,
    iban,
    bic,
    address,
    reference,
    currencies: selectedCurrencies,
  })

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const save = () => {
    validate({
      label: {
        required: true,
        duplicate: view === 'new' && getPaymentDataByLabel(label)
      },
      beneficiary: {
        required: true,
      },
      iban: {
        required: true,
        iban: true
      },
      bic: {
        required: false,
        bic: true
      },
      address: {
        required: false,
      },
      reference: {
        required: false,
      },
    })
    if (!isFormValid()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    save
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, iban, beneficiary, bic, address, reference, selectedCurrencies])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $beneficiary?.focus()}
        value={label}
        disabled={view === 'view'}
        label={i18n('form.paymentMethodName')}
        isValid={!isFieldInError('label')}
        autoCorrect={false}
        errorMessage={getErrorsInField('label')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setBeneficiary}
        onSubmit={() => $iban?.focus()}
        reference={(el: any) => $beneficiary = el}
        value={beneficiary}
        disabled={view === 'view'}
        label={i18n('form.beneficiary')}
        isValid={!isFieldInError('beneficiary')}
        autoCorrect={false}
        errorMessage={getErrorsInField('beneficiary')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setIBAN}
        onSubmit={() => $bic?.focus()}
        reference={(el: any) => $iban = el}
        value={iban}
        disabled={view === 'view'}
        label={i18n('form.iban')}
        isValid={!isFieldInError('iban')}
        autoCorrect={false}
        errorMessage={getErrorsInField('iban')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setBIC}
        onSubmit={() => $address?.focus()}
        reference={(el: any) => $bic = el}
        value={bic}
        required={false}
        disabled={view === 'view'}
        label={i18n('form.bic')}
        isValid={!isFieldInError('bic')}
        autoCorrect={false}
        errorMessage={getErrorsInField('bic')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setAddress}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => $address = el}
        value={address}
        required={false}
        disabled={view === 'view'}
        label={i18n('form.address')}
        isValid={!isFieldInError('address')}
        autoCorrect={false}
        errorMessage={getErrorsInField('address')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => $reference = el}
        value={reference}
        required={false}
        disabled={view === 'view'}
        label={i18n('form.reference')}
        isValid={!isFieldInError('reference')}
        autoCorrect={false}
        errorMessage={getErrorsInField('reference')}
      />
    </View>
    <CurrencySelection style={tw`mt-2`}
      paymentMethod="sepa"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}