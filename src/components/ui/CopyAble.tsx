import React, { ReactElement, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Pressable } from 'react-native'
import { Fade } from '../animation'
import { Text } from '../text'
import i18n from '../../utils/i18n'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

type CopyAbleProps = ComponentProps & {
  value: string
  color?: string
  disabled?: boolean
}
export const CopyAble = ({ value, color, disabled, style }: CopyAbleProps): ReactElement => {
  const [showCopied, setShowCopied] = useState(false)

  const copy = () => {
    Clipboard.setString(value)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }
  return (
    <Pressable onPress={copy} disabled={disabled} style={[tw`flex-row justify-center flex-shrink w-4 h-4`, style]}>
      <Icon id="copy" style={tw`w-full h-full`} color={color || tw`text-primary-main`.color} />
      <Fade show={showCopied} duration={300} delay={0} style={tw`absolute mt-1 top-full`}>
        <Text style={[tw`tooltip text-primary-main`]}>{i18n('copied')}</Text>
      </Fade>
    </Pressable>
  )
}
