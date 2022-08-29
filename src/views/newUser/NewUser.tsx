/* eslint-disable max-lines-per-function */
import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  Pressable,
  TextInput,
  View
} from 'react-native'

import Logo from '../../assets/logo/peachLogo.svg'
import { Button, Input, Loading, Text } from '../../components'
import Icon from '../../components/Icon'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import NDA from '../../overlays/NDA'
import SaveYourPassword from '../../overlays/SaveYourPassword'
import tw from '../../styles/tailwind'
import { account, createAccount, deleteAccount } from '../../utils/account'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { error } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { auth } from '../../utils/peachAPI'
import { getMessages, rules } from '../../utils/validation'
import userUpdate from '../../init/userUpdate'
const { LinearGradient } = require('react-native-gradients')
const { useValidation } = require('react-native-form-validator')

type Props = {
  navigation: StackNavigation
}

// eslint-disable-next-line max-statements
export default ({ navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [referralCode, setReferralCode] = useState('')
  const [isPristine, setIsPristine] = useState(true)
  const [loading, setLoading] = useState(false)
  let $passwordRepeat = useRef<TextInput>(null).current
  let $referral = useRef<TextInput>(null).current

  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { password, referralCode },
    rules,
    messages: getMessages()
  })

  const validateForm = () => (!password || !passwordRepeat) || validate({
    password: {
      required: true,
      password: true,
    },
    referralCode: {
      referralCode: true
    }
  })

  const checkPasswordMatch = () => {
    if (password && passwordRepeat) {
      setPasswordMatch(password === passwordRepeat)
      return password === passwordRepeat
    }
    return true
  }

  const onPasswordChange = (value: string) => {
    setPassword(value)

    if (!isPristine) {
      checkPasswordMatch()
      validateForm()
    }
  }

  const onError = (e: Error) => {
    updateMessage({
      msg: i18n(e.message || 'AUTHENTICATION_FAILURE'),
      level: 'ERROR',
    })
    deleteAccount({
      onSuccess: () => {
        setLoading(false)
        updateOverlay({ content: null })
      }
    })
  }

  const onSuccess = async () => {
    try {
      const [result, authError] = await auth()
      if (result) {
        await userUpdate(referralCode)
        storeAccount(account, password)

        setLoading(false)
        navigation.replace('home', {})
      } else {
        onError(new Error(authError?.error))
      }
    } catch (e) {
      onError(e as Error)
    }
  }

  const onPasswordRepeatChange = (value: string) => {
    setPasswordRepeat(value)

    if (!isPristine) {
      checkPasswordMatch()
      validateForm()
    }
  }

  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  const submit = () => {
    setIsPristine(false)
    const pwMatch = checkPasswordMatch()
    if (pwMatch && validateForm()) {
      Keyboard.dismiss()
      setLoading(true)

      // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
      setTimeout(() => {
        createAccount({ password, onSuccess, onError })
      })

      setTimeout(() => {
        updateOverlay({ content: <SaveYourPassword />, showCloseButton: false })
      }, 300)
    }
  }

  useEffect(() => {
    validateForm()
  }, [referralCode])

  useEffect(() => updateOverlay({ content: <NDA />, showCloseButton: false }), [])

  return <View style={tw`h-full flex justify-center px-6`}>
    <View style={tw`h-full flex-shrink p-6 flex-col items-center justify-between`}>
      <View />{/* dummy for layout */}
      <View style={tw`h-full flex-shrink flex-col items-center justify-end mt-16 pb-10`}>
        <Logo style={[tw`flex-shrink max-w-full w-96 max-h-96 h-full`, { minHeight: 48 }]} />
      </View>
      <View style={tw`w-full`}>
        <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
          {i18n(loading ? 'newUser.title.create' : 'newUser.title.new')}
        </Text>
        {loading
          ? <View style={tw`h-1/2`}>
            <Loading />
          </View>
          : <View>
            <Text style={tw`mt-4 text-center`}>
              {i18n('newUser.description.1')}
            </Text>
            <Text style={tw`mt-1 text-center`}>
              {i18n('newUser.description.2')}
            </Text>
          </View>
        }
      </View>
      <View />{/* dummy for layout */}
    </View>
    {!loading
      ? <View style={tw`pb-8 mt-4 flex items-center w-full bg-white-1`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <View>
          <Text style={[
            tw`font-baloo text-2xs text-grey-3 text-center`,
            !passwordMatch || isFieldInError('password') ? tw`text-red` : {}
          ]}>
            {!passwordMatch
              ? i18n('form.password.match.error')
              : i18n('form.password.error')
            }
          </Text>
          <Input testID="newUser-password"
            onChange={onPasswordChange}
            onSubmit={focusToPasswordRepeat}
            secureTextEntry={true}
            value={password}
            isValid={!isPristine && !isFieldInError('password') && passwordMatch}
            errorMessage={!passwordMatch || isFieldInError('password') ? [''] : []}
          />
        </View>
        <View style={tw`mt-2 h-12`}>
          <Input testID="newUser-passwordRepeat"
            reference={(el: any) => $passwordRepeat = el}
            onChange={onPasswordRepeatChange}
            onSubmit={(val: string) => {
              onPasswordRepeatChange(val)
              $referral?.focus()
            }}
            secureTextEntry={true}
            value={passwordRepeat}
            isValid={!isPristine && !isFieldInError('passwordRepeat') && passwordMatch}
            errorMessage={!passwordMatch || isFieldInError('passwordRepeat') ? [''] : []}
          />
        </View>
        <View style={tw`mt-4 h-12 px-4`}>
          <Text style={tw`font-baloo text-2xs text-grey-3 text-center`}>
            {i18n('newUser.referralCode')}
          </Text>
          <Input testID="newUser-referralCode"
            reference={(el: any) => $referral = el}
            onChange={setReferralCode}
            onSubmit={(val: string) => {
              setReferralCode(val)
              submit()
            }}
            value={referralCode}
            autoCapitalize="characters"
            isValid={!isFieldInError('referralCode')}
            errorMessage={referralCode.length && getErrorsInField('referralCode')}
          />
        </View>
        <View style={tw`w-full mt-10 flex items-center`}>
          <Pressable style={tw`absolute left-0`} onPress={() => navigation.replace('welcome', {})}>
            <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
          </Pressable>
          <Button testID="newUser-register"
            onPress={submit}
            wide={false}
            disabled={!password || !passwordRepeat || !passwordMatch
              || isFieldInError('password') || isFieldInError('passwordRepeat')}
            title={i18n('createAccount')}
          />
        </View>
      </View>
      : null
    }
  </View>
}