import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useOpenWithdrawalConfirmationPopup } from './useOpenWithdrawalConfirmationPopup'

const amount = sellOffer.amount
const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
const feeRate = estimatedFees.halfHourFee
const fee = feeRate * 110
const transaction = getTransactionDetails(amount, feeRate)
const transactionWithChange = getTransactionDetails(amount, feeRate)
transactionWithChange.txDetails.sent = sellOffer.amount + 5000

const onSuccess = jest.fn()
const props = {
  address,
  amount,
  feeRate,
  shouldDrainWallet: false,
  onSuccess,
}
jest.mock('../../../utils/wallet/transaction/buildTransaction', () => ({
  buildTransaction: jest.fn(() => transaction),
}))

const wrapper = NavigationWrapper

describe('useOpenWithdrawalConfirmationPopup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should open confirmation popup', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await result.current(props)
    expect(usePopupStore.getState()).toEqual(
      expect.objectContaining({
        title: 'sending funds',
        level: 'APP',
        content: <WithdrawalConfirmation {...{ address, amount, fee, feeRate }} />,
        action1: {
          label: 'confirm & send',
          icon: 'arrowRightCircle',
          callback: expect.any(Function),
        },
        action2: {
          label: 'cancel',
          icon: 'xCircle',
          callback: usePopupStore.getState().closePopup,
        },
      }),
    )
  })

  it('should broadcast transaction, reset state and navigate to wallet on confirm', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await act(async () => {
      await result.current(props)
    })
    const promise = usePopupStore.getState().action1?.callback()

    await act(async () => {
      await promise
    })

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
    expect(usePopupStore.getState().visible).toBe(false)
    expect(useWalletState.getState().selectedUTXOIds).toEqual([])
    expect(navigateMock).toHaveBeenCalledWith('wallet')
  })

  it('should be able to send all funds', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await act(async () => {
      await result.current({ ...props, shouldDrainWallet: true })
    })
    const promise = usePopupStore.getState().action1?.callback()

    await act(async () => {
      await promise
    })

    expect(peachWallet.buildFinishedTransaction).toHaveBeenCalledWith({
      address: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
      amount: 250000,
      feeRate: 6,
      shouldDrainWallet: true,
      utxos: undefined,
    })
    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
  })

  it('should close popup on cancel', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await act(async () => {
      await result.current(props)
    })
    usePopupStore.getState().action2?.callback()

    expect(usePopupStore.getState().visible).toBe(false)
  })
})
