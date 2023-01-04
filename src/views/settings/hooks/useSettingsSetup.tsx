import analytics from '@react-native-firebase/analytics'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { AppState } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { account, updateSettings } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { checkNotificationStatus, isProduction, toggleNotifications } from '../../../utils/system'
import { NotificationPopup } from '../components/NotificationPopup'
import { SettingsItemProps } from '../components/SettingsItem'

const headerConfig = { title: i18n('settings.title'), hideGoBackButton: true }

const contactUs = (() => {
  let arr: SettingsItemProps[] = [{ title: 'contact' }, { title: 'aboutPeach' }]
  if (!isProduction()) arr = [{ title: 'testView' }, ...arr]
  return arr
})()

const profileSettings = [
  { title: 'myProfile' },
  { title: 'referrals' },
  {
    title: 'backups',
    iconId: account.settings.showBackupReminder ? 'alertTriangle' : undefined,
    warning: !!account.settings.showBackupReminder,
  },
  { title: 'networkFees' },
  { title: 'paymentMethods' },
  { title: 'refundAddress' },
  { title: 'payoutAddress' },
] as const

export const useSettingsSetup = () => {
  const navigation = useNavigation()
  useHeaderSetup(headerConfig)
  const [, updateOverlay] = useContext(OverlayContext)

  const [notificationsOn, setNotificationsOn] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(account.settings.enableAnalytics)

  useFocusEffect(
    useCallback(() => {
      const checkingFunction = async () => {
        setNotificationsOn(await checkNotificationStatus())
      }
      const eventListener = AppState.addEventListener('change', checkingFunction)

      checkingFunction()

      return () => {
        eventListener.remove()
      }
    }, []),
  )

  const toggleAnalytics = () => {
    setAnalyticsOn(!account.settings.enableAnalytics)
    analytics().setAnalyticsCollectionEnabled(!account.settings.enableAnalytics)
    updateSettings({
      enableAnalytics: !account.settings.enableAnalytics,
    })
  }
  const goToCurrencySettings = useCallback(() => navigation.navigate('currency'), [navigation])

  const notificationClick = useCallback(() => {
    if (notificationsOn) {
      updateOverlay({
        title: i18n('settings.notifications.overlay.title'),
        content: <NotificationPopup />,
        visible: true,
        level: 'WARN',
        action2: {
          callback: () => updateOverlay({ visible: false }),
          label: i18n('settings.notifications.overlay.neverMind'),
          icon: 'arrowLeftCircle',
        },
        action1: {
          callback: () => {
            updateOverlay({ visible: false })
            toggleNotifications()
          },
          label: i18n('settings.notifications.overlay.yes'),
          icon: 'slash',
        },
      })
    } else {
      toggleNotifications()
    }
  }, [notificationsOn, updateOverlay])

  const appSettings: SettingsItemProps[] = useMemo(
    () => [
      {
        title: 'peachWallet',
        onPress: () => null,
        iconId: false ? 'toggleRight' : 'toggleLeft',
        enabled: false,
      },
      {
        title: 'analytics',
        onPress: toggleAnalytics,
        iconId: analyticsOn ? 'toggleRight' : 'toggleLeft',
        enabled: analyticsOn,
      },
      {
        title: 'notifications',
        onPress: notificationClick,
      },
      { title: 'currency', onPress: goToCurrencySettings },
    ],
    [analyticsOn, goToCurrencySettings, notificationClick],
  )

  const settings = [
    { items: contactUs },
    { headline: 'profileSettings', items: profileSettings },
    { headline: 'appSettings', items: appSettings },
  ]

  return settings
}
