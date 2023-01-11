import React, { ReactElement, useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'

import { Input, PeachScrollView, Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { useNavigation, useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { account, backupAccount, updateSettings } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'

const passwordRules = { required: true, password: true }

export default (): ReactElement => {
  const navigation = useNavigation()
  const [password, setPassword, passwordIsValid, passwordError] = useValidatedState<string>('', passwordRules)
  const [passwordRepeat, setPasswordRepeat, passwordRepeatIsValid, passwordRepeatError] = useValidatedState<string>(
    '',
    passwordRules,
  )

  const [isBackingUp, setIsBackingUp] = useState(false)

  let $passwordRepeat = useRef<TextInput>(null).current
  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  const passwordsMatch = useMemo(() => password === passwordRepeat, [password, passwordRepeat])
  const validate = () => !!password && !!passwordRepeat && passwordIsValid && passwordsMatch

  const startAccountBackup = () => {
    if (isBackingUp || !validate()) return

    Keyboard.dismiss()

    const previousDate = account.settings.lastBackupDate
    const previousShowBackupReminder = account.settings.showBackupReminder
    setIsBackingUp(true)
    updateSettings(
      {
        lastBackupDate: new Date().getTime(),
        showBackupReminder: false,
      },
      true,
    )
    backupAccount({
      password,
      onSuccess: () => {
        setIsBackingUp(false)
        updateSettings(
          {
            lastBackupDate: new Date().getTime(),
            showBackupReminder: false,
          },
          true,
        )
        navigation.navigate('backupCreated')
      },
      // TODO: why are we not saving the settings in these cases?
      onCancel: () => {
        setIsBackingUp(false)
        updateSettings({
          lastBackupDate: previousDate,
          showBackupReminder: previousShowBackupReminder,
        })
      },
      onError: () => {
        setIsBackingUp(false)
        updateSettings({
          lastBackupDate: previousDate,
          showBackupReminder: previousShowBackupReminder,
        })
      },
    })
  }

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`h-full`}>
        <View style={tw`justify-center h-full mx-8`}>
          <Text style={tw`self-center mb-4 tooltip`}>{i18n('settings.backups.createASecurePassword')}</Text>
          <Input
            testID="backup-password"
            placeholder={i18n('form.password.placeholder')}
            onChange={setPassword}
            onSubmit={focusToPasswordRepeat}
            secureTextEntry={true}
            value={password}
            errorMessage={passwordError}
            style={passwordIsValid && tw`border-black-2`}
            iconColor={tw`text-black-2`.color}
          />
          <Input
            testID="backup-passwordRepeat"
            placeholder={i18n('form.repeatpassword.placeholder')}
            reference={(el: any) => ($passwordRepeat = el)}
            onChange={setPasswordRepeat}
            onSubmit={setPasswordRepeat}
            secureTextEntry={true}
            value={passwordRepeat}
            errorMessage={passwordRepeatError}
            style={passwordRepeatIsValid && tw`border-black-2`}
            iconColor={tw`text-black-2`.color}
          />
        </View>
      </PeachScrollView>
      <PrimaryButton disabled={!validate()} style={tw`self-center mb-6`} onPress={startAccountBackup} iconId="save" wide>
        {i18n('settings.backups.fileBackup.createNew')}
      </PrimaryButton>
    </>
  )
}
