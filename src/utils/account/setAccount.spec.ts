import { deepStrictEqual, ok } from 'assert'
import { account, setAccount } from '.'
import { getPeachAccount } from '../peachAPI/peachAccount'
import { getWallet } from '../wallet'
import * as accountData from '../../../tests/unit/data/accountData'

describe('setAccount', () => {
  it('sets an account, sets wallet and peachAccount', async () => {
    await setAccount(accountData.account1, true)
    deepStrictEqual(account, accountData.account1)
    ok(getWallet())
    ok(getPeachAccount())
  })
})
