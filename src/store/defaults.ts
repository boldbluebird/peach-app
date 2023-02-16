import { BLOCKEXPLORER } from '@env'
import { APPVERSION } from '../constants'

export const defaultConfig: Config = {
  peachPGPPublicKey: '',
  peachFee: 0.015,
  minAppVersion: APPVERSION,
  latestAppVersion: APPVERSION,
  minTradingAmount: 200000,
  maxTradingAmount: 5000000,
}

export const defaultSettings: Settings = {
  appVersion: APPVERSION,
  displayCurrency: 'EUR',
  locale: 'en',
  minBuyAmount: defaultConfig.minTradingAmount,
  maxBuyAmount: defaultConfig.maxTradingAmount,
  sellAmount: defaultConfig.minTradingAmount,
  preferredPaymentMethods: {},
  meansOfPayment: {},
  premium: 1.5,
  showBackupReminder: true,
  peachWalletActive: true,
  nodeURL: BLOCKEXPLORER,
  customFeeRate: 1,
  selectedFeeRate: 'halfHourFee',
}
