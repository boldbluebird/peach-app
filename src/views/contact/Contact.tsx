import React, { ReactElement, useCallback, useContext } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, PeachScrollView, PrimaryButton } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { useNavigation } from '../../hooks'
import { useHeaderState } from '../../components/header/store'
import { useFocusEffect } from '@react-navigation/native'
import LinedText from '../../components/ui/LinedText'

const contactReasons = ['bug', 'userProblem', 'other'] as const
type ContactReason = typeof contactReasons[number]
type ContactButtonProps = { name: ContactReason; setReason: Function }

const ContactButton = ({ name, setReason }: ContactButtonProps) => (
  <PrimaryButton onPress={() => setReason(name)} style={tw`mt-2`} wide border baseColor={tw`text-black-2`}>
    {i18n(`contact.reason.${name}`)}
  </PrimaryButton>
)

export default (): ReactElement => {
  const navigation = useNavigation()
  useContext(LanguageContext)

  const setReason = (reason: ContactReason) => navigation.navigate('report', { reason })

  const setHeaderState = useHeaderState((state) => state.setHeaderState)

  useFocusEffect(
    useCallback(() => {
      setHeaderState({ title: i18n('contact.title').toLocaleLowerCase() })
    }, [setHeaderState]),
  )

  const openTelegram = () => {
    // TODO : Open telegram
  }

  const openDiscord = () => {
    // TODO : Open Discord
  }

  return (
    <PeachScrollView contentContainerStyle={tw`py-6 flex-grow bg-primary-background`}>
      <View style={tw`h-full items-center p-6 justify-center`}>
        <LinedText text={i18n('report.mailUs')} />
        {contactReasons.map((name) => (
          <ContactButton {...{ name, setReason, key: `contact-button-${name}` }} />
        ))}
        <View style={tw`mt-10 w-full items-center`}>
          <LinedText text={i18n('report.communityHelp')} />
          <PrimaryButton onPress={openTelegram} style={tw`mt-2`} wide border baseColor={tw`text-black-2`}>
            {i18n('telegram')}
          </PrimaryButton>
          <PrimaryButton onPress={openDiscord} style={tw`mt-2`} wide border baseColor={tw`text-black-2`}>
            {i18n('telegram')}
          </PrimaryButton>
        </View>
        <GoBackButton style={tw`mt-12`} />
      </View>
    </PeachScrollView>
  )
}
