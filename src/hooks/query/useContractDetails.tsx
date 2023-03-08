import { useIsFocused } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { getContract } from '../../utils/peachAPI'
import { getContract as getStoredContract } from '../../utils/contract'

const getContractQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, contractId] = queryKey
  const [contract] = await getContract({ contractId })

  return contract
}

export const useContractDetails = (id: string, refetchInterval?: number) => {
  const initialContract = getStoredContract(id)
  const isFocused = useIsFocused()
  const { data, isLoading, refetch, error } = useQuery(['contract', id], getContractQuery, {
    initialData: initialContract,
    initialDataUpdatedAt: initialContract?.lastModified?.getTime(),
    refetchInterval,
    enabled: isFocused,
  })

  return { contract: data, isLoading, refetch, error }
}
