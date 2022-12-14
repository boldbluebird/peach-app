import { deepStrictEqual, ok } from 'assert'
import { account, setAccount } from '../../../../src/utils/account'
import { getPeachAccount } from '../../../../src/utils/peachAPI/peachAccount'
import { getWallet } from '../../../../src/utils/wallet'
import * as accountData from '../../data/accountData'
import { resetStorage } from '../../prepare'

describe('setAccount', () => {
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('sets an account, sets wallet and peachAccount', async () => {
    await setAccount(accountData.account1, true)
    deepStrictEqual(account, accountData.account1)
    ok(getWallet())
    ok(getPeachAccount())
  })
})
