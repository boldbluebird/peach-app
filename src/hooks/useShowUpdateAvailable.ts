import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useSetToast } from '../components/toast/Toast'
import { APPVERSION, BUILDNUMBER } from '../constants'
import { useConfigStore } from '../store/configStore/configStore'
import i18n from '../utils/i18n'
import { compatibilityCheck } from '../utils/system/compatibilityCheck'
import { linkToAppStore } from '../utils/system/linkToAppStore'

export const useShowUpdateAvailable = () => {
  const setToast = useSetToast()
  const [minAppVersion, latestAppVersion] = useConfigStore(
    (state) => [state.minAppVersion, state.latestAppVersion],
    shallow,
  )

  useEffect(() => {
    if (!compatibilityCheck(`${APPVERSION} (${BUILDNUMBER})`, minAppVersion)) return
    if (compatibilityCheck(`${APPVERSION} (${BUILDNUMBER})`, latestAppVersion)) return
    setToast({
      msgKey: 'UPDATE_AVAILABLE',
      color: 'yellow',
      keepAlive: true,
      action: {
        onPress: linkToAppStore,
        label: i18n('download'),
        iconId: 'download',
      },
    })
  }, [latestAppVersion, minAppVersion, setToast])

  useEffect(() => {
    if (compatibilityCheck(`${APPVERSION} (${BUILDNUMBER})`, minAppVersion)) return
    setToast({
      msgKey: 'CRITICAL_UPDATE_AVAILABLE',
      color: 'red',
      keepAlive: true,
      action: {
        onPress: linkToAppStore,
        label: i18n('download'),
        iconId: 'download',
      },
    })
  }, [minAppVersion, setToast])
}
