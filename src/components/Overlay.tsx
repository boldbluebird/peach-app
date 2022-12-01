import React, { ReactElement, useContext, useEffect } from 'react'
import { BackHandler, Pressable, View } from 'react-native'
import { PrimaryButton } from '.'

import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import Icon from './Icon'

/**
 * @description Component to display the Overlay
 * @param props Component properties
 * @param props.content the overlay content
 * @param props.showCloseIcon if true show close icon
 * @param props.showCloseButton if true show close button
 * @param props.help if true show overlay as help
 * @example
 * <Overlay content={<Text>Overlay content</Text>} showCloseButton={true} />
 */
export const Overlay = ({ content, showCloseIcon, showCloseButton, onClose, help }: OverlayState): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => {
    if (onClose) onClose()
    updateOverlay({ content: null, showCloseButton: true })
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!(showCloseIcon || showCloseButton)) return true
      closeOverlay()
      return true
    })
    return () => {
      backHandler.remove()
    }
  }, [content, showCloseIcon, showCloseButton])

  return (
    <View
      testID="overlay"
      style={[
        tw`absolute z-20 w-full h-full flex items-center justify-center`,
        tw`p-3 pb-8`,
        help ? tw`bg-blue-translucent-2` : tw`bg-peach-translucent-2`,
      ]}
    >
      {showCloseIcon ? (
        <Pressable onPress={closeOverlay} style={tw`absolute z-20 top-5 right-5`}>
          <Icon id="cross" style={tw`w-8 h-8`} color={tw`text-white-1`.color as string} />
        </Pressable>
      ) : null}

      {content}

      {showCloseButton ? (
        <PrimaryButton style={tw`mt-7`} onPress={closeOverlay}>
          {i18n('close')}
        </PrimaryButton>
      ) : null}
    </View>
  )
}

export default Overlay
