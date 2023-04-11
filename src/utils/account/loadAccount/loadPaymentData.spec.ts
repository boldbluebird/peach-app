import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '..'
import { loadPaymentData } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadPaymentData', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })

  it('loads payment data', async () => {
    await storeAccount(accountData.account1)

    const paymentData = await loadPaymentData()
    deepStrictEqual(paymentData, accountData.account1.paymentData)
  })
})
