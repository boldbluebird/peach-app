import { OfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import { keys } from '../object'

export const getNewPreferredPaymentMethods = (
  preferredPaymentMethods: OfferPreferences['preferredPaymentMethods'],
  updateDatedPaymentData: PaymentData[],
) =>
  keys(preferredPaymentMethods).reduce((obj, method) => {
    const id = preferredPaymentMethods[method]
    const data = updateDatedPaymentData.find((d) => d.id === id)
    let newObj = { ...obj }
    if (data && !data.hidden) newObj = { ...newObj, [method]: id }
    return newObj
  }, {} satisfies OfferPreferences['preferredPaymentMethods'])
