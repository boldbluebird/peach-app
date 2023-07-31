import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'

export type TradeSummaryState = {
  lastModified: Date
  offers: OfferSummary[]
  contracts: ContractSummary[]
}

type TradeSummaryStore = TradeSummaryState & {
  reset: () => void
  setOffers: (offers: OfferSummary[]) => void
  setOffer: (offerId: string, data: Partial<OfferSummary>) => void
  getOffer: (offerId: string) => OfferSummary | undefined
  setContracts: (contracts: ContractSummary[]) => void
  setContract: (contractId: string, data: Partial<ContractSummary>) => void
  getContract: (contractId: string) => ContractSummary | undefined
}

export const defaultTradeSummaryState: TradeSummaryState = {
  offers: [],
  contracts: [],
  lastModified: new Date(0),
}
export const tradeSummaryStorage = createStorage('tradeSummary')

export const useTradeSummaryStore = create(
  persist<TradeSummaryStore>(
    (set, get) => ({
      ...defaultTradeSummaryState,
      reset: () => set(() => defaultTradeSummaryState),
      setOffers: (offers) => set((state) => ({ ...state, offers, lastModified: new Date() })),
      setOffer: (offerId, data) => {
        let itemFound = false
        const offers = get().offers.map((offer) => {
          if (offer.id === offerId) {
            offer = {
              ...offer,
              ...data,
            }
            itemFound = true
          }
          return offer
        })

        if (!itemFound) {
          offers.push(data as OfferSummary)
        }

        return set((state) => ({ ...state, offers }))
      },
      getOffer: (offerId) => get().offers.find(({ id }) => id === offerId),
      setContracts: (contracts) => set((state) => ({ ...state, contracts, lastModified: new Date() })),
      setContract: (contractId, data) => {
        let itemFound = false
        const contracts = get().contracts.map((contract) => {
          if (contract.id === contractId) {
            contract = {
              ...contract,
              ...data,
            }
            itemFound = true
          }
          return contract
        })
        if (!itemFound) {
          contracts.push(data as ContractSummary)
        }

        return set((state) => ({ ...state, contracts }))
      },
      getContract: (contractId) => get().contracts.find(({ id }) => id === contractId),
    }),
    {
      name: 'tradeSummary',
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(tradeSummaryStorage)),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.setOffers(
          state.offers.map((offer) => ({
            ...offer,
            creationDate: new Date(offer.creationDate),
            lastModified: new Date(offer.lastModified),
          })),
        )
        state.setContracts(
          state.contracts.map((contract) => ({
            ...contract,
            creationDate: new Date(contract.creationDate),
            lastModified: new Date(contract.lastModified),
            paymentMade: contract.paymentMade ? new Date(contract.paymentMade) : undefined,
            paymentConfirmed: contract.paymentConfirmed ? new Date(contract.paymentConfirmed) : undefined,
          })),
        )
      },
    },
  ),
)
