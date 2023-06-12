import { BIP32Interface } from 'bip32'
import { setPeachAccount } from '../peachAPI/peachAccount'
import { setWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { setPeachWallet } from '../wallet/setWallet'
import { createPeachAccount } from './createPeachAccount'

export const setWallets = (wallet: BIP32Interface, seedPhrase: string) => {
  setWallet(wallet)
  setPeachAccount(createPeachAccount(wallet))

  const peachWallet = new PeachWallet({ wallet })
  peachWallet.loadWallet(seedPhrase)
  setPeachWallet(peachWallet)
}
