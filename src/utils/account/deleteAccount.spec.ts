import { ok } from 'assert'
import * as accountData from '../../../tests/unit/data/accountData'
import { useSessionStore } from '../../store/sessionStore'
import { settingsStorage } from '../../store/settingsStore'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { peachAPI } from '../peachAPI'
import { setAccount } from './account'
import { accountStorage } from './accountStorage'
import { chatStorage } from './chatStorage'
import { deleteAccount } from './deleteAccount'
import { offerStorage } from './offerStorage'

describe('deleteAccount', () => {
  beforeAll(() => {
    setAccount(accountData.account1)
  })

  it('would delete account file', () => {
    const usePaymentDataStoreReset = jest.spyOn(usePaymentDataStore.getState(), 'reset')
    const useSessionStoreReset = jest.spyOn(useSessionStore.getState(), 'reset')
    deleteAccount()

    expect(accountStorage.clearStore).toHaveBeenCalled()
    expect(offerStorage.clearStore).toHaveBeenCalled()
    expect(chatStorage.clearStore).toHaveBeenCalled()
    expect(settingsStorage.clearStore).toHaveBeenCalled()
    expect(usePaymentDataStoreReset).toHaveBeenCalled()
    expect(useSessionStoreReset).toHaveBeenCalled()
    expect(peachAPI.apiOptions.peachAccount).toBeNull()

    ok(true)
  })
})
