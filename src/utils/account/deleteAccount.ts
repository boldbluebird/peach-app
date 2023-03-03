import analytics from '@react-native-firebase/analytics'

import { defaultAccount, setAccount } from '.'
import { notificationStorage, notificationStore } from '../../components/footer/notificationsStore'
import { configStore } from '../../store/configStore'
import { settingsStorage, settingsStore } from '../../store/settingsStore'
import { info } from '../log'
import { logoutUser } from '../peachAPI'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { sessionStorage } from '../session'
import { walletStorage, walletStore } from '../wallet/walletStore'
import { accountStorage } from './accountStorage'
import { chatStorage } from './chatStorage'
import { contractStorage } from './contractStorage'
import { offerStorage } from './offerStorage'

export const deleteAccount = async () => {
  info('Deleting account')

  setAccount(defaultAccount, true)
  ;[
    accountStorage,
    walletStorage,
    offerStorage,
    contractStorage,
    chatStorage,
    sessionStorage,
    settingsStorage,
    notificationStorage,
  ].forEach((storage) => storage.clearStore())
  ;[notificationStore, configStore, walletStore, settingsStore].map((store) => store.getState().reset())

  logoutUser({})

  deleteAccessToken()
  deletePeachAccount()
  analytics().logEvent('account_deleted')
}
