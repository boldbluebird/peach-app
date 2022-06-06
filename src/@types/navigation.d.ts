declare type RootStackParamList = {
  [key: string]: {},
  home: {},
  sell: {
    offer?: SellOffer,
    page?: number
  },
  buy: {
    offer?: BuyOffer,
    page?: number
  },
  search: {
    offer: SellOffer|BuyOffer,
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
  offers: {},
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