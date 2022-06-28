import React, { ReactElement, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import { OverlayContext } from '../../../../contexts/overlay'
import keyboard from '../../../../effects/keyboard'
import PaymentMethodEdit from '../../../../overlays/info/PaymentMethodEdit'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel, removePaymentData } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { paymentDataChanged } from '../../../../utils/paymentMethod'
import { getMessages, rules } from '../../../../utils/validation'
import { Fade } from '../../../animation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'
const { useValidation } = require('react-native-form-validator')


// eslint-disable-next-line max-lines-per-function
export const PayPal = ({ forwardRef, view, data, onSubmit, onChange }: PaymentMethodFormProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [email, setEmail] = useState(data?.email || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [currencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  let $phone = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current
  let $userName = useRef<TextInput>(null).current
  const anyFieldSet = !!(phone || userName || email)

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, phone, userName, email },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & PaypalData => ({
    id: data?.id || `paypal-${new Date().getTime()}`,
    label,
    type: 'paypal',
    phone,
    email,
    userName,
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
      phone: {
        required: !email && !userName,
        phone: true
      },
      email: {
        required: !phone && !userName,
        email: !phone && !userName
      },
      userName: {
        required: !phone && !email,
        userName: true
      },
    })
    if (!isFormValid()) return

    if (onSubmit) {
      if (data && paymentDataChanged(data as PaymentData, buildPaymentData())) {
        updateOverlay({
          content: <PaymentMethodEdit paymentData={buildPaymentData()} onConfirm={onSubmit} />,
          help: true
        })
      } else {
        onSubmit(buildPaymentData())
      }
    }
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    save
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, phone, email, userName, selectedCurrencies])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $phone?.focus()}
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
        onChange={setPhone}
        onSubmit={() => $email?.focus()}
        reference={(el: any) => $phone = el}
        value={phone}
        required={!anyFieldSet}
        disabled={view === 'view'}
        label={i18n('form.phone')}
        isValid={!isFieldInError('phone')}
        autoCorrect={false}
        errorMessage={getErrorsInField('phone')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setEmail}
        onSubmit={() => $userName?.focus()}
        reference={(el: any) => $email = el}
        required={!anyFieldSet}
        value={email}
        disabled={view === 'view'}
        label={i18n('form.email')}
        isValid={!isFieldInError('userName')}
        autoCorrect={false}
        errorMessage={getErrorsInField('userName')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={(usr: string) => {
          setUserName(usr.length && !/@/ug.test(usr) ? `@${usr}` : usr)
        }}
        onSubmit={() => {
          setUserName((user: string) => !/@/ug.test(userName) ? `@${userName}` : user)
          save()
        }}
        reference={(el: any) => $userName = el}
        required={!anyFieldSet}
        value={userName}
        disabled={view === 'view'}
        label={i18n('form.userName')}
        isValid={!isFieldInError('userName')}
        autoCorrect={false}
        errorMessage={getErrorsInField('userName')}
      />
    </View>
    <CurrencySelection style={tw`mt-2`}
      paymentMethod="paypal"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}