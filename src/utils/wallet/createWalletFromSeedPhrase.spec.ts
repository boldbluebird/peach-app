import { deepStrictEqual, strictEqual } from 'assert'
import { getNetwork } from '.'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'

describe('createWalletFromSeedPhrase', () => {
  it('recovers a wallet from mnemonic', () => {
    const network = getNetwork()
    const expectedPrivateKey = 'ba4e90a60a8a6a7df66f0158e529e38fd3bea2b6b75b1f5007da6d47942b43cc'
    const expectedPublicKey = '02e327f0e1669a6c9aa052c861ba13a966972d1ba6b2e4f793c9a1ce4b06950231'
    const recoveredWallet = createTestWallet()

    deepStrictEqual(recoveredWallet.network, network, 'Network is not correct')
    strictEqual(recoveredWallet.privateKey.toString('hex'), expectedPrivateKey)
    strictEqual(recoveredWallet.publicKey.toString('hex'), expectedPublicKey)
  })
})
