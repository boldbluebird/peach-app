import { act, renderHook, waitFor } from 'test-utils'
import { OfferSummary } from '../../peach-api/src/@types/offer'
import { account1 } from '../../tests/unit/data/accountData'
import { sellOffer } from '../../tests/unit/data/offerData'
import { offerSummary } from '../../tests/unit/data/offerSummaryData'
import { getTransactionDetails } from '../../tests/unit/helpers/getTransactionDetails'
import { MSINAMINUTE } from '../constants'
import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import { defaultAccount, setAccount } from '../utils/account/account'
import { sum } from '../utils/math/sum'
import { PeachWallet } from '../utils/wallet/PeachWallet'
import { setPeachWallet } from '../utils/wallet/setWallet'
import { useWalletState } from '../utils/wallet/walletStore'
import { useCheckFundingMultipleEscrows } from './useCheckFundingMultipleEscrows'

jest.useFakeTimers()

const refetchMock = jest.fn()
const useOfferSummariesMock = jest.fn().mockReturnValue({
  refetch: () => refetchMock(),
})

const refreshMock = jest.fn().mockResolvedValue(true)
const useSyncWalletMock = jest.fn().mockReturnValue({
  refresh: () => refreshMock(),
})
jest.mock('../views/wallet/hooks/useSyncWallet', () => ({
  useSyncWallet: (...args: unknown[]) => useSyncWalletMock(...args),
}))
jest.mock('./query/useOfferSummaries', () => ({
  useOfferSummaries: (...args: unknown[]) => useOfferSummariesMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('useCheckFundingMultipleEscrows', () => {
  const sellOffer1 = sellOffer
  const sellOffer2 = { ...sellOffer, id: '39', escrow: 'escrow2' }
  const sellOffer3 = { ...sellOffer, id: '40', escrow: 'escrow3' }
  const sellOfferSummary1: OfferSummary = { ...offerSummary, id: sellOffer1.id, type: 'ask' }
  const sellOfferSummary2: OfferSummary = { ...sellOfferSummary1, id: sellOffer2.id }
  const sellOfferSummary3: OfferSummary = { ...sellOfferSummary1, id: sellOffer3.id }
  const sellOffers = [sellOffer1, sellOffer2, sellOffer3]
  const sellOfferSummaries = [sellOfferSummary1, sellOfferSummary2, sellOfferSummary3]
  const fundingAmount = sellOffers.map((o) => o.amount).reduce(sum, 0)
  const txDetails = getTransactionDetails(fundingAmount, 1)

  // @ts-ignore
  const peachWallet = new PeachWallet()
  peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails)
  const getAddressUTXOSpy = jest.spyOn(peachWallet, 'getAddressUTXO')
  const signAndBroadcastPSBTSpy = jest.spyOn(peachWallet, 'signAndBroadcastPSBT')

  beforeAll(() => {
    setPeachWallet(peachWallet)
  })
  beforeEach(() => {
    setAccount({ ...account1, offers: sellOffers })
    useTradeSummaryStore.getState().reset()
    useTradeSummaryStore.getState().setOffers(sellOfferSummaries)
    refetchMock.mockResolvedValue(sellOfferSummaries)
    useWalletState.getState().registerFundMultiple(
      'address',
      sellOffers.map((o) => o.id),
    )
  })
  it('check each registered address for funding each minute', async () => {
    getAddressUTXOSpy.mockResolvedValueOnce([])
    renderHook(useCheckFundingMultipleEscrows)

    expect(getAddressUTXOSpy).not.toHaveBeenCalled()
    act(() => {
      jest.advanceTimersByTime(MSINAMINUTE)
    })
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
    await waitFor(() => expect(refetchMock).toHaveBeenCalled())
    expect(getAddressUTXOSpy).toHaveBeenCalledWith('address')

    getAddressUTXOSpy.mockResolvedValueOnce([])
    act(() => {
      jest.advanceTimersByTime(MSINAMINUTE)
    })
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
    await waitFor(() => expect(refetchMock).toHaveBeenCalled())
    expect(getAddressUTXOSpy).toHaveBeenCalledTimes(2)
  })
  it('craft batched funding transaction once funds have been detected in address', async () => {
    renderHook(useCheckFundingMultipleEscrows)

    act(() => {
      jest.advanceTimersByTime(MSINAMINUTE)
    })
    await waitFor(() => expect(signAndBroadcastPSBTSpy).toHaveBeenCalledWith(txDetails.psbt))
  })
  it('unregisters batch funding once batched tx has been broadcasted and registered by peach server', async () => {
    expect(useWalletState.getState().fundMultipleMap).toEqual({
      address: ['38', '39', '40'],
    })
    renderHook(useCheckFundingMultipleEscrows)

    act(() => {
      jest.advanceTimersByTime(MSINAMINUTE)
    })
    await waitFor(() => expect(signAndBroadcastPSBTSpy).toHaveBeenCalledWith(txDetails.psbt))
    expect(useWalletState.getState().fundMultipleMap).toEqual({})
    act(() => {
      useTradeSummaryStore.getState().reset()
      useTradeSummaryStore.getState().setOffers(sellOfferSummaries.map((offer) => ({ ...offer, fundingTxId: '1' })))
    })
    act(() => {
      jest.advanceTimersByTime(MSINAMINUTE)
    })
    expect(useWalletState.getState().fundMultipleMap).toEqual({})
  })
  it('aborts if no escrow addresses can be found', async () => {
    setAccount(defaultAccount)
    renderHook(useCheckFundingMultipleEscrows)

    act(() => {
      jest.advanceTimersByTime(MSINAMINUTE)
    })
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
    await waitFor(() => expect(refetchMock).toHaveBeenCalled())
    expect(getAddressUTXOSpy).not.toHaveBeenCalled()
  })
  it('aborts if no local utxo can be found', async () => {
    renderHook(useCheckFundingMultipleEscrows)

    getAddressUTXOSpy.mockResolvedValueOnce([])
    act(() => {
      jest.advanceTimersByTime(MSINAMINUTE)
    })
    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
    await waitFor(() => expect(refetchMock).toHaveBeenCalled())
    expect(signAndBroadcastPSBTSpy).not.toHaveBeenCalled()
  })
})
