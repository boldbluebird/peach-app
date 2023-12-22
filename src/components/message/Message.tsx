import { useEffect, useRef } from 'react'
import { Animated, SafeAreaView, TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { shallow } from 'zustand/shallow'
import { IconType } from '../../assets/icons'
import { useNavigation } from '../../hooks/useNavigation'
import { VerifyYouAreAHumanPopup } from '../../popups/warning/VerifyYouAreAHumanPopup'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { messageShadow } from '../../utils/layout/shadows'
import { error } from '../../utils/log'
import { parseError } from '../../utils/result/parseError'
import { isNetworkError } from '../../utils/system/isNetworkError'
import { Icon } from '../Icon'
import { Placeholder } from '../Placeholder'
import { PeachText } from '../text/PeachText'
import { iconMap } from './iconMap'
import { useMessageState } from './useMessageState'

type LevelColorMap = {
  bg: Record<Level, ViewStyle>
  text: Record<Level, TextStyle>
}
const levelColorMap: LevelColorMap = {
  bg: {
    APP: tw`bg-primary-main`,
    SUCCESS: tw`bg-success-background-main`,
    WARN: tw`bg-warning-mild-1`,
    ERROR: tw`bg-error-main`,
    INFO: tw`bg-info-background`,
    DEFAULT: tw`bg-black-5`,
  },
  text: {
    APP: tw`text-primary-background-main`,
    SUCCESS: tw`text-black-100`,
    WARN: tw`text-black-100`,
    ERROR: tw`text-primary-background-light`,
    INFO: tw`text-black-100`,
    DEFAULT: tw`text-black-100`,
  },
}

export const Message = () => {
  const setPopup = usePopupStore((state) => state.setPopup)
  const [{ level, msgKey, bodyArgs = [], action, onClose, time, keepAlive }, updateMessage] = useMessageState(
    (state) => [
      {
        level: state.level,
        msgKey: state.msgKey,
        bodyArgs: state.bodyArgs,
        action: state.action,
        onClose: state.onClose,
        time: state.time,
        keepAlive: state.keepAlive,
      },
      state.updateMessage,
    ],
    shallow,
  )
  const navigation = useNavigation()

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({
      msgKey: err.message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigation.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    const errorMessage = parseError(err)

    if (errorMessage === 'HUMAN_VERIFICATION_REQUIRED') {
      setPopup(<VerifyYouAreAHumanPopup />)
      return
    }
    const errorMsgKey = isNetworkError(errorMessage) ? 'NETWORK_ERROR' : errorMessage
    updateMessage({
      msgKey: errorMsgKey || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigation.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  const { width } = useWindowDimensions()
  const top = useRef(new Animated.Value(-width)).current

  useEffect(() => {
    let slideOutTimeout: NodeJS.Timer

    if (msgKey) {
      Animated.timing(top, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start()

      if (!keepAlive) {
        slideOutTimeout = setTimeout(
          () =>
            Animated.timing(top, {
              toValue: -width,
              duration: 300,
              useNativeDriver: false,
            }).start(),
          1000 * 10,
        )
      }
    }

    return () => clearTimeout(slideOutTimeout)
  }, [msgKey, time])

  if (!msgKey) return null

  const icon: IconType | undefined = iconMap[msgKey]
  let title = i18n(`${msgKey}.title`)
  let message = i18n(`${msgKey}.text`, ...bodyArgs)

  if (title === `${msgKey}.title`) title = ''
  if (message === `${msgKey}.text`) {
    message = i18n(msgKey, ...bodyArgs)
  }

  const closeMessage = () => {
    updateMessage({ msgKey: undefined, level: 'ERROR' })
    if (onClose) onClose()
  }

  return (
    <Animated.View style={[tw`absolute z-20 w-full`, { top }]}>
      <SafeAreaView>
        <View
          style={[
            tw`flex items-center justify-center px-4 pt-4 pb-2 m-6 rounded-2xl`,
            messageShadow,
            levelColorMap.bg[level],
          ]}
        >
          <View style={tw`p-2`}>
            <View style={tw`flex-row items-center justify-center`}>
              {!!icon && <Icon id={icon} style={tw`w-5 h-5 mr-2`} color={levelColorMap.text[level].color} />}
              {!!title && <PeachText style={[tw`text-center h6`, levelColorMap.text[level]]}>{title}</PeachText>}
            </View>
            {!!message && (
              <PeachText style={[tw`text-center body-m`, levelColorMap.text[level], !!title && tw`mt-1`]}>
                {message}
              </PeachText>
            )}
          </View>
          <View style={tw`flex flex-row items-center justify-between w-full mt-1`}>
            {action ? (
              <TouchableOpacity onPress={action.callback} style={tw`flex flex-row items-center`}>
                {!!action.icon && <Icon id={action.icon} style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />}
                <PeachText style={[tw`leading-relaxed subtitle-2`, levelColorMap.text[level]]}>{action.label}</PeachText>
              </TouchableOpacity>
            ) : (
              <Placeholder />
            )}
            <TouchableOpacity onPress={closeMessage} style={tw`flex flex-row items-center text-right`}>
              <PeachText style={[tw`leading-relaxed subtitle-2`, levelColorMap.text[level]]}>{i18n('close')} </PeachText>
              <Icon id="xSquare" style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  )
}
