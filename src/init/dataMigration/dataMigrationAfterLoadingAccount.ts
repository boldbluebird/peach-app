import { PAYMENTMETHODINFOS } from '../../constants'
import { checkSupportedPaymentMethods } from './afterLoadingAccount/checkSupportedPaymentMethods'
import { enforcePaymentDataFormats } from './afterLoadingAccount/enforcePaymentDataFormats'

export const dataMigrationAfterLoadingAccount = async (account: Account) => {
  checkSupportedPaymentMethods(account.paymentData, PAYMENTMETHODINFOS)
  enforcePaymentDataFormats(account.paymentData)
}
