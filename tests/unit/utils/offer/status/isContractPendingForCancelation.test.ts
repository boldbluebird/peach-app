import { ok } from 'assert'
import { isContractPendingForCancelation } from '../../../../../src/utils/offer/status'
import { contract } from '../../../data/contractData'

describe('isContractPendingForCancelation', () => {
  it('should check if a cancelation was requested', () => {
    ok(
      isContractPendingForCancelation({
        ...contract,
        cancelationRequested: true,
      }),
    )
    ok(
      !isContractPendingForCancelation({
        ...contract,
        cancelationRequested: false,
      }),
    )
  })
})
