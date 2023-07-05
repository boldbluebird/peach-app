import { APPVERSION } from '../constants'

export const defaultConfig: Config = {
  paymentMethods: [],
  peachPGPPublicKey: '',
  peachFee: 0.015,
  minAppVersion: APPVERSION,
  latestAppVersion: APPVERSION,
  minTradingAmount: 0,
  maxTradingAmount: Infinity,
  seenDisputeDisclaimer: false,
}
