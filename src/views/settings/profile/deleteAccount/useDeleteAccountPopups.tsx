import { useCallback } from 'react'
import { useNavigation } from '../../../../hooks'
import { usePopupStore } from '../../../../store/usePopupStore'
import { deleteAccount } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { logoutUser } from '../../../../utils/peachAPI'
import { DeleteAccountPopup } from './DeleteAccountPopup'

export const useDeleteAccountPopups = () => {
  const setPopup = usePopupStore((state) => state.setPopup)
  const navigation = useNavigation()

  const showPopup = useCallback(
    (content: JSX.Element, callback?: () => void, isSuccess = false) =>
      setPopup({
        visible: true,
        title: i18n(`settings.deleteAccount.${isSuccess ? 'success' : 'popup'}.title`),
        content,
        level: 'ERROR',
        action2:
          !isSuccess && callback
            ? {
              label: i18n('settings.deleteAccount'),
              icon: 'trash',
              callback,
            }
            : undefined,
      }),
    [setPopup],
  )

  const deleteAccountClicked = () => {
    deleteAccount()
    logoutUser({})
    navigation.reset({
      index: 0,
      routes: [{ name: 'welcome' }],
    })
    showPopup(<DeleteAccountPopup title={'success'} />, undefined, true)
  }

  const showForRealsiesPopup = () => {
    showPopup(<DeleteAccountPopup title={'forRealsies'} />, deleteAccountClicked)
  }
  const showDeleteAccountPopup = () => {
    showPopup(<DeleteAccountPopup title={'popup'} />, showForRealsiesPopup)
  }

  return showDeleteAccountPopup
}
