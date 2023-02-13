import { isDisputeActive } from './../../../../../src/utils/contract/status/isDisputeActive'
import { ok } from 'assert'
import { contract } from '../../../data/contractData'

describe('isDisputeActive', () => {
  it('should check if there`s an open dispute', () => {
    ok(
      isDisputeActive({
        ...contract,
        disputeActive: true,
      }),
    )
    ok(
      !isDisputeActive({
        ...contract,
        disputeActive: false,
      }),
    )
  })
})
