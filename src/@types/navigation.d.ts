declare type RootStackParamList = {
  [key: string]: {},
  home: {},
  newUser: {},
  login: {},
  restoreBackup: {},
  sell: {
    amount: number,
    offer?: SellOffer,
    page?: number
  },
  buy: {
    amount: number,
    offer?: BuyOffer,
    page?: number
  },
  buyPreferences: {
    amount: number,
    offer?: BuyOffer,
    page?: number,
  },
  addPaymentMethod: {},
  paymentDetails: {
    paymentMethod: PaymentMethod,
    currencies: Currency[],
    paymentData?: PaymentData,
  },
  search: {
    offer: SellOffer|BuyOffer,
    hasMatches?: boolean,
  },
  contract: {
    contractId: Contract['id'],
  },
  contractChat: {
    contractId: Contract['id'],
  },
  dispute: {
    contractId: Contract['id'],
  },
  tradeComplete: {
    contract: Contract,
  },
  yourTrades: {},
  offer: {
    offer: SellOffer|BuyOffer,
  },
  settings: {},
  contact: {},
  report: {
    reason: ContactReason,
  },
  language: {},
  currency: {},
  profile: {
    userId: User['id'],
    user?: User,
  },
  backups: {},
  seedWords: {},
  escrow: {},
  paymentMethods: {},
  deleteAccount: {},
  fees: {},
  socials: {},
}