import { paymentDetailInfo, twintData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { accountStorage } from '../../../utils/account/accountStorage'
import { migratePaymentDataToStore } from './migratePaymentDataToStore'

describe('migratePaymentDataToStore', () => {
  const paymentData = [validSEPAData, twintData]
  beforeAll(() => {
    useOfferPreferences.setState({ preferredPaymentMethods: {} })
    accountStorage.setArray('paymentData', paymentData)
  })
  afterEach(() => {
    usePaymentDataStore.getState().reset()
    useOfferPreferences.setState({ preferredPaymentMethods: {} })
  })

  it('migrates payment data from account to paymentDataStore', () => {
    migratePaymentDataToStore()
    expect(usePaymentDataStore.getState().paymentData).toEqual({
      [validSEPAData.id]: validSEPAData,
      [twintData.id]: twintData,
    })
    expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({
      [validSEPAData.type]: validSEPAData.id,
      [twintData.type]: twintData.id,
    })
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual(paymentDetailInfo)
    expect(usePaymentDataStore.getState().migrated).toBeTruthy()
  })
  it('does nothing if already migrated', () => {
    usePaymentDataStore.getState().setMigrated()
    migratePaymentDataToStore()
    expect(usePaymentDataStore.getState().paymentData).toEqual({})
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual({})
    expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({})
  })
})
