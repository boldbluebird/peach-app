import { getBuildNumber, getUniqueId, getVersion } from 'react-native-device-info'
import { unique } from './utils/array'
import { sha256 } from './utils/crypto'
import Countries from './views/addPaymentMethod/Countries'

export const SATSINBTC = 100000000

export let PEACHPGPPUBLICKEY = ''
export const setPeachPGPPublicKey = (pgpPublicKey: string) => PEACHPGPPUBLICKEY = pgpPublicKey

export let PEACHFEE = 0.015
export const setPeachFee = (fee: number) => PEACHFEE = fee

export const MAXMININGFEE = 20000

// time go automatically restart app when calling app from background after this time has passed
export const TIMETORESTART = 1000 * 60 * 5

export const APPVERSION = getVersion()
export const BUILDNUMBER = getBuildNumber()
export const UNIQUEID = sha256(getUniqueId())

export let MINAPPVERSION = APPVERSION
export const setMinAppVersion = (ver: string) => MINAPPVERSION = ver

export let LATESTAPPVERSION = APPVERSION
export const setLatestAppVersion = (ver: string) => LATESTAPPVERSION = ver

export let CURRENCIES: Currency[] = [
  'EUR',
  'CHF',
  'GBP',
  'SEK',
]

export let COUNTRIES: Country[] = ['DE', 'FR', 'IT', 'ES', 'NL', 'UK', 'SE']

export let PAYMENTMETHODS: PaymentMethod[] = ['sepa']
export let PAYMENTMETHODINFOS: PaymentMethodInfo[] = [
  {
    id: 'sepa',
    currencies: ['EUR', 'CHF', 'GBP'],
    exchange: true
  }
]

export const PAYMENTCATEGORIES: PaymentCategories = {
  bankTransfer: ['sepa'],
  onlineWallet: ['paypal', 'revolut', 'wise', 'twint', 'swish'],
  giftCard: ['giftCard.amazon'].concat(COUNTRIES.map(c => `giftCard.amazon.${c}`)) as PaymentMethod[],
  localOption: ['mbWay', 'bizum'],
  cash: ['cash'],
  cryptoCurrency: []
}

export const LOCALPAYMENTMETHODS: LocalPaymentMethods = {
  EUR: {
    PT: ['mbWay'],
    ES: ['bizum'],
  }
}

export const APPLINKS: Partial<Record<PaymentMethod, { appLink?: string, url: string, userLink?: string}>> = {
  paypal: {
    appLink: 'paypal://',
    url: 'https://paypal.com/open_web',
    userLink: 'https://paypal.com/paypalme/',
  },
  revolut: {
    url: 'https://revolut.com/app',
    userLink: 'https://revolut.me/',
  },
  wise: { url: 'https://wise.com/user/account' },
  'giftCard.amazon.DE': { url: 'https://www.amazon.de/dp/B0B2Q4ZRDW' },
  'giftCard.amazon.FR': { url: 'https://www.amazon.fr/dp/B004MYH1YI' },
  'giftCard.amazon.IT': { url: 'https://www.amazon.it/dp/B07DWRCL44' },
  'giftCard.amazon.ES': { url: 'https://www.amazon.es/dp/B07H8STZ9N' },
  'giftCard.amazon.NL': { url: 'https://www.amazon.nl/dp/B07W6D728D' },
  'giftCard.amazon.UK': { url: 'https://www.amazon.co.uk/dp/B07S6C1DZ6' },
  'giftCard.amazon.SE': { url: 'https://www.amazon.se/dp/B089VNKFM7' },
}

export const setPaymentMethods = (paymentMethodInfos: PaymentMethodInfo[]) => {
  PAYMENTMETHODINFOS = paymentMethodInfos
  CURRENCIES = paymentMethodInfos
    .reduce((arr, info) => arr.concat(info.currencies), [] as Currency[])
    .filter(unique())
  COUNTRIES = paymentMethodInfos
    .reduce((arr, info) => arr.concat(info.countries || []), [] as Country[])
    .filter(unique())
  PAYMENTMETHODS = paymentMethodInfos.map(method => method.id)
}

export let BUCKETS = [
  50000,
  100000,
  200000,
  350000,
  500000
]
export let DEPRECATED_BUCKETS: number[] = []
export const setBuckets = (buckets: number[]) => BUCKETS = buckets
export const setDeprecatedBuckets = (buckets: number[]) => DEPRECATED_BUCKETS = buckets

type Timers = {
  [key in ContractAction]: number
}

// Time in ms
export const TIMERS: Timers = {
  none: 0,
  kycResponse: 1000 * 60 * 60 * 12,
  sendPayment: 1000 * 60 * 60 * 12,
  confirmPayment: 1000 * 60 * 60 * 12,
}

// Reputation
export const GOLDMEDAL = 0.9
export const SILVERMEDAL = 0.7

export const MEDALS = ['fastTrader', 'superTrader', 'ambassador']
