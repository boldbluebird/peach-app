import { useMemo } from 'react'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'

export const useTransactionHistorySetup = () => {
  const storedTransactions = useWalletState((state) => state.transactions)

  const transactions = useMemo(
    () =>
      storedTransactions
        .map(getTxSummary)
        .sort((a, b) => (a.date === b.date ? 0 : a.date > b.date ? 1 : -1))
        .reverse(),
    [storedTransactions],
  )

  return {
    transactions,
  }
}
