import { revolutData, validSEPAData, validSEPADataHashes } from '../../../../../tests/unit/data/paymentData'
import { useOfferPreferences } from '../../../offerPreferenes'
import { defaultPreferences } from '../../../offerPreferenes/useOfferPreferences'
import { usePaymentDataStore } from '../../../usePaymentDataStore'
import { migrateSettings } from './migrateSettings'

// eslint-disable-next-line max-lines-per-function
describe('migrateSettings', () => {
  beforeEach(() => {
    useOfferPreferences.setState(defaultPreferences)
    usePaymentDataStore.getState().reset()
  })
  it('should migrate from version 0', () => {
    const persistedState = {
      lastBackupDate: '2021-07-12T13:00:00.000Z',
      preferredPaymentMethods: { sepa: 'sepa-1234', revolut: 'revolut-1234' },
      premium: 1,
      minBuyAmount: 100,
      maxBuyAmount: 1000,
      sellAmount: 100,
    }
    const migratedState = migrateSettings(persistedState, 0)
    expect(migratedState).toEqual({
      lastFileBackupDate: '2021-07-12T13:00:00.000Z',
    })
  })

  it('should migrate from version 1', () => {
    const persistedState = {
      meansOfPayment: {
        EUR: ['sepa'],
      },
      preferredPaymentMethods: { sepa: validSEPAData.id, revolut: revolutData.id },
      premium: 1,
      minBuyAmount: 100,
      maxBuyAmount: 1000,
      sellAmount: 100,
    }
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePaymentDataStore.getState().addPaymentData(revolutData)
    const migratedState = migrateSettings(persistedState, 1)
    expect(migratedState).toEqual({
      lastFileBackupDate: undefined,
    })
    expect(useOfferPreferences.getState()).toEqual(
      expect.objectContaining({
        buyAmountRange: [100, 1000],
        meansOfPayment: {
          EUR: ['sepa'],
        },
        originalPaymentData: [validSEPAData],
        paymentData: {
          sepa: {
            country: undefined,
            hashes: validSEPADataHashes,
          },
        },
        preferredPaymentMethods: {
          sepa: validSEPAData.id,
        },
        premium: 1,
        sellAmount: 100,
      }),
    )
  })

  it('should migrate from version 2', () => {
    const persistedState = {
      appVersion: '1.0.0',
      analyticsPopupSeen: true,
      enableAnalytics: true,
      locale: 'en',
      returnAddress: '0x123456789',
      payoutAddress: '0x123456789',
      payoutAddressLabel: 'My address',
      payoutAddressSignature: '0x123456789',
      derivationPath: "m/44'/60'/0'/0",
      displayCurrency: 'EUR',
      country: 'DE',
      pgpPublished: true,
      fcmToken: '123456789',
      lastFileBackupDate: 123456789,
      lastSeedBackupDate: 123456789,
      showBackupReminder: true,
      shouldShowBackupOverlay: {
        completedBuyOffer: true,
        refundedEscrow: true,
        bitcoinReceived: true,
      },
      peachWalletActive: true,
      nodeURL: 'https://node.url',
      feeRate: 'fastestFee',
      usedReferralCode: true,
      lastBackupDate: 123456789,
    }
    const migratedState = migrateSettings(persistedState, 2)
    expect(migratedState).toEqual({
      ...persistedState,
      shouldShowBackupOverlay: true,
    })
    expect(migratedState).not.toHaveProperty('lastBackupDate')
  })
})
