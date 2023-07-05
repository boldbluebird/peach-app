import { PaymentDetailInfo } from '../../../src/store/usePaymentDataStore/types'

export const validSEPAData: PaymentData = {
  id: 'sepa-1669721660451',
  label: 'SEPA EUR',
  type: 'sepa',
  beneficiary: 'Hal Finney',
  iban: 'IE29 AIBK 9311 5212 3456 78',
  bic: 'AAAA BB CC 123',
  currencies: ['EUR'],
}
export const validSEPAData2: PaymentData = {
  id: 'sepa-1669721660452',
  label: 'SEPA 2',
  type: 'sepa',
  beneficiary: 'Kolge',
  iban: 'IE29 AIBK 9311 5212 3456 78',
  bic: 'AAAA BB CC 123',
  currencies: ['EUR'],
}

export const validSEPADataHashes = [
  '2b46d198979c80a25ee51ec0bb846f09b3b159e4e35893b666543c1094f009e8',
  'd8b722319ca44fd92fcfc69ae913a8d5b03a4ba394ebd2fa2bf609a93c763dfd',
  '8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3',
]

export const missingSEPAData: PaymentData = {
  id: 'sepa-1669721660451',
  label: 'SEPA EUR Missing Data',
  type: 'sepa',
  currencies: ['EUR'],
}

export const invalidSEPADataCurrency: PaymentData = {
  ...validSEPAData,
  currencies: ['CHF'],
}

export const validCashData: PaymentData = {
  id: 'cash-1669721660451',
  label: 'Cash EUR',
  type: 'cash.es.barcelonabitcoin',
  currencies: ['EUR'],
  country: 'ES',
}

export const twintData: PaymentData = {
  id: 'twint-1669721660451',
  label: 'Twint',
  type: 'twint',
  phone: '+341234875987',
  currencies: ['CHF'],
}

export const twintDataHashes = ['c56ab971aeea3e5aa3d2e62e4ed7cb5488a63b0659e6db7b467e7f899cb7b418']

export const paymentDetailInfo: PaymentDetailInfo = {
  beneficiary: { [validSEPADataHashes[0]]: validSEPAData.beneficiary! },
  bic: { [validSEPADataHashes[1]]: validSEPAData.bic! },
  iban: { [validSEPADataHashes[2]]: validSEPAData.iban! },
  phone: { [twintDataHashes[0]]: twintData.phone! },
}
