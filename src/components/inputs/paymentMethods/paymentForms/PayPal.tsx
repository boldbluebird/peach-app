import React, { ReactElement, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import { OverlayContext } from '../../../../contexts/overlay'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const PayPal = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [email, setEmail] = useState(data?.email || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  let $phone = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current
  let $userName = useRef<TextInput>(null).current
  const anyFieldSet = !!(phone || userName || email)

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { label, phone, userName, email },
    rules,
    messages: getMessages()
  })

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const buildPaymentData = (): PaymentData & PaypalData => ({
    id: data?.id || `paypal-${new Date().getTime()}`,
    label,
    type: 'paypal',
    phone,
    email,
    userName,
    currencies: selectedCurrencies,
  })

  const validateForm = () => validate({
    label: {
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id
    },
    phone: {
      required: !email && !userName,
      phone: true
    },
    email: {
      required: !phone && !userName,
      email: true
    },
    userName: {
      required: !phone && !email,
      userName: true
    },
  })
  const save = () => {
    if (!validateForm()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    validateForm,
    save,
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, phone, email, userName])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $phone?.focus()}
        value={label}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        isValid={!isFieldInError('label')}
        autoCorrect={false}
        errorMessage={label.length && getErrorsInField('label')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={(number: string) => {
          setPhone((number.length && !/\+/ug.test(number) ? `+${number}` : number).replace(/[^0-9+]/ug, ''))
        }}
        onSubmit={() => {
          setPhone((number: string) => (!/\+/ug.test(number) ? `+${number}` : number).replace(/[^0-9+]/ug, ''))
          $email?.focus()
        }}
        reference={(el: any) => $phone = el}
        value={phone}
        required={!anyFieldSet}
        label={i18n('form.phone')}
        placeholder={i18n('form.phone.placeholder')}
        isValid={!isFieldInError('phone')}
        autoCorrect={false}
        errorMessage={phone.length && getErrorsInField('phone')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={setEmail}
        onSubmit={() => $userName?.focus()}
        reference={(el: any) => $email = el}
        required={!anyFieldSet}
        value={email}
        label={i18n('form.email')}
        placeholder={i18n('form.email.placeholder')}
        isValid={!isFieldInError('email')}
        autoCorrect={false}
        errorMessage={email.length && getErrorsInField('email')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={(usr: string) => {
          setUserName(usr.length && !/@/ug.test(usr) ? `@${usr}` : usr)
        }}
        onSubmit={() => {
          setUserName((usr: string) => !/@/ug.test(usr) ? `@${usr}` : usr)
          save()
        }}
        reference={(el: any) => $userName = el}
        required={!anyFieldSet}
        value={userName}
        label={i18n('form.userName')}
        placeholder={i18n('form.userName.placeholder')}
        isValid={!isFieldInError('userName')}
        autoCorrect={false}
        errorMessage={userName.length && getErrorsInField('userName')}
      />
    </View>
    <CurrencySelection
      paymentMethod="paypal"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}