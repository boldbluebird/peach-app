import { info } from '../../log'
import { contractStorage } from '../accountStorage'

export const storeContracts = async (contracts: Account['contracts']) => {
  info('storeContracts - Storing contracts', contracts.length)

  await Promise.all(
    contracts.filter(({ id }) => id).map((contract) => contractStorage.setMapAsync(contract.id, contract)),
  )
}
