import { account } from '.'
import { settingsStore } from '../../store/settingsStore'
import { getPaymentData } from './getPaymentData'
import { getPaymentDataByType } from './getPaymentDataByType'
import { storePaymentData } from './storeAccount'

/**
 * @description Method to remove payment data
 * @param id id of payment data to remove
 */
export const removePaymentData = async (id: PaymentData['id']) => {
  const dataToBeRemoved = getPaymentData(id)
  if (!dataToBeRemoved) return

  account.paymentData = account.paymentData.filter((data) => data.id !== id)

  if (account.settings.preferredPaymentMethods[dataToBeRemoved.type]) {
    const nextInLine = getPaymentDataByType(dataToBeRemoved.type).shift()
    settingsStore.getState().setPreferredPaymentMethods({
      ...account.settings.preferredPaymentMethods,
      [dataToBeRemoved.type]: nextInLine?.id || '',
    })
  }

  await storePaymentData(account.paymentData)
}
