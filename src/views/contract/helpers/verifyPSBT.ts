import { Psbt } from 'bitcoinjs-lib'
import { MAXMININGFEE, PEACHFEE } from '../../../constants'
import { txIdPartOfPSBT } from '../../../utils/bitcoin'

/**
 * @description Method to verify that a psbt is indeed meant for the current contract
 * @param psbt partially signed bitcoin transaction
 * @param sellOffer sell offer
 * @param contract contract
 * @returns error message ids
 */
export const verifyPSBT = (psbt: Psbt, sellOffer: SellOffer, contract: Contract): string => {
  if (!sellOffer || !sellOffer.funding?.txIds) return 'MISSING_DATA'

  const txIds = sellOffer.funding.txIds
  if (!txIds.every((txId) => txIdPartOfPSBT(txId, psbt))) {
    return 'INVALID_INPUT'
  }

  if (psbt.txOutputs.every((output) => output.address !== contract.releaseAddress)) {
    return 'RETURN_ADDRESS_MISMATCH'
  }

  // make sure buyer receives agreed amount minus fees
  const buyerOutput = psbt.txOutputs.find((output) => output.address === contract.releaseAddress)
  if (PEACHFEE > 0) {
    const peachFeeOutput = psbt.txOutputs.find((output) => output.address !== contract.releaseAddress)
    if (
      !peachFeeOutput
      || peachFeeOutput.value !== contract.amount * PEACHFEE
      || !buyerOutput
      || buyerOutput.value < contract.amount - peachFeeOutput.value - MAXMININGFEE
    ) {
      return 'INVALID_OUTPUT'
    }
  } else if (!buyerOutput || buyerOutput.value < contract.amount - MAXMININGFEE) {
    return 'INVALID_OUTPUT'
  }
  return errorMsg
}
