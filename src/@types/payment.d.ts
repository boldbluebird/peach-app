type EuPaymentMethods =
  | 'advcash'
  | 'applePay'
  | 'bizum'
  | 'blik'
  | 'fasterPayments'
  | 'friends24'
  | 'instantSepa'
  | 'iris'
  | 'keksPay'
  | 'lydia'
  | 'mbWay'
  | 'mobilePay'
  | 'n26'
  | 'nationalTransferBG'
  | 'nationalTransferCZ'
  | 'nationalTransferDK'
  | 'nationalTransferHU'
  | 'nationalTransferNO'
  | 'nationalTransferPL'
  | 'nationalTransferRO'
  | 'nationalTransferTR'
  | 'neteller'
  | 'papara'
  | 'paylib'
  | 'paypal'
  | 'paysera'
  | 'revolut'
  | 'satispay'
  | 'sepa'
  | 'skrill'
  | 'straksbetaling'
  | 'swish'
  | 'twint'
  | 'vipps'
  | 'wise'
type LatAmPaymentMethods =
  | 'alias'
  | 'bancolombia'
  | 'cbu'
  | 'cvu'
  | 'mercadoPago'
  | 'nequi'
  | 'rappipay'
  | 'sinpe'
  | 'sinpeMovil'
type AfricaPaymentMethods =
  | 'airtelMoney'
  | 'chippercash'
  | 'eversend'
  | 'm-pesa'
  | 'moov'
  | 'mtn'
  | 'nationalTransferNG'
  | 'orangeMoney'
  | 'payday'
  | 'wave'
type BitcoinPaymentMethods = 'liquid' | 'lnurl'
type InternationalPaymentMethds = 'giftCard.amazon' | `giftCard.amazon.${Country}`
type CashPaymentMethds = 'cash' | `cash.${string}`

type PaymentMethod =
  | EuPaymentMethods
  | LatAmPaymentMethods
  | AfricaPaymentMethods
  | InternationalPaymentMethds
  | BitcoinPaymentMethods
  | CashPaymentMethds
