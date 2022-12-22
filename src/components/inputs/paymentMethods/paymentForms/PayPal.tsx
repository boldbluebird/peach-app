import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '.'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation, TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import Input from '../../Input'
import { PhoneInput } from '../../PhoneInput'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'email',
    display: i18n('form.email'),
  },
  {
    id: 'userName',
    display: i18n('form.userName'),
  },
  {
    id: 'phone',
    display: i18n('form.phone'),
  },
]
const referenceRules = { required: false }

export const PayPal = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [email, setEmail] = useState(data?.email || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [reference, setReference, isReferenceValid, referenceError] = useValidatedState(
    data?.reference || '',
    referenceRules,
  )
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)
  const [displayErrors, setDisplayErrors] = useState(false)

  let $reference = useRef<TextInput>(null).current

  const labelRules = {
    required: true,
    duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
  }
  const phoneRules = { required: !email && !userName, phone: true }
  const emailRules = { required: !phone && !userName, email: true }
  const userNameRules = { required: !phone && !email, userName: true }

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const phoneErrors = useMemo(() => getErrorsInField(phone, phoneRules), [phone, phoneRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])
  const userNameErrors = useMemo(() => getErrorsInField(userName, userNameRules), [userName, userNameRules])

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const buildPaymentData = (): PaymentData & PaypalData => ({
    id: data?.id || `paypal-${Date.now()}`,
    label,
    type: 'paypal',
    phone,
    email,
    userName,
    currencies: selectedCurrencies,
  })

  const isFormValid = () => {
    setDisplayErrors(true)
    return [...labelErrors, ...phoneErrors, ...emailErrors, ...userNameErrors].length === 0
  }

  const save = () => {
    if (!isFormValid()) return
    onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    save,
  }))

  useEffect(() => {
    setStepValid(isFormValid())
  }, [isFormValid, setStepValid])

  return (
    <View>
      <View>
        <Input
          onChange={setLabel}
          value={label}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
        />
      </View>
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />

      {currentTab.id === 'phone' && (
        <View style={tw`mt-2`}>
          <PhoneInput
            onChange={setPhone}
            onSubmit={(number: string) => {
              setPhone(number)
              $reference?.focus()
            }}
            value={phone}
            required={true}
            placeholder={i18n('form.phone.placeholder')}
            autoCorrect={false}
            errorMessage={displayErrors ? phoneErrors : undefined}
          />
        </View>
      )}

      {currentTab.id === 'email' && (
        <View style={tw`mt-2`}>
          <Input
            onChange={setEmail}
            onSubmit={() => $reference?.focus()}
            required={true}
            value={email}
            placeholder={i18n('form.email.placeholder')}
            autoCorrect={false}
            errorMessage={displayErrors ? emailErrors : undefined}
          />
        </View>
      )}
      {currentTab.id === 'userName' && (
        <View style={tw`mt-2`}>
          <Input
            onChange={(usr: string) => {
              setUserName(usr.length && !/@/gu.test(usr) ? `@${usr}` : usr)
            }}
            onSubmit={() => {
              setUserName((usr: string) => (!/@/gu.test(usr) ? `@${usr}` : usr))
              $reference?.focus()
            }}
            required={true}
            value={userName}
            placeholder={i18n('form.userName.placeholder')}
            autoCorrect={false}
            errorMessage={displayErrors ? userNameErrors : undefined}
          />
        </View>
      )}
      <Input
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        value={reference}
        required={false}
        label={i18n('form.reference')}
        placeholder={i18n('form.reference.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? referenceError : undefined}
      />
      <CurrencySelection paymentMethod="paypal" selectedCurrencies={selectedCurrencies} onToggle={onCurrencyToggle} />
    </View>
  )
}
