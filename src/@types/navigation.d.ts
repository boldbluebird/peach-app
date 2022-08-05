declare type RootStackParamList = {
  [key: string]: {},
  home: {},
  newUser: {},
  login: {},
  restoreBackup: {},
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
  sell: {
    amount: number,
    offer?: SellOffer,
    page?: number
  },
  addPaymentMethod: {
    currency?: Currency,
    paymentMethod?: PaymentMethod,
  },
  paymentDetails: {
    paymentData: Partial<PaymentData> & {
      type: PaymentMethod,
      currencies: Currency[],
    },
    origin: keyof RootStackParamList
  },
  fundEscrow: {
    offer: SellOffer
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