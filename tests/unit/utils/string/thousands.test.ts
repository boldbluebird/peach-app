import { strictEqual } from 'assert'
import { thousands } from '../../../../src/utils/string'

describe('thousands', () => {
  it('groups a number into thousands', () => {
    strictEqual(thousands(1), '1')
    strictEqual(thousands(12), '12')
    strictEqual(thousands(123), '123')
    strictEqual(thousands(1234), '1 234')
    strictEqual(thousands(12345), '12 345')
    strictEqual(thousands(123456), '123 456')
    strictEqual(thousands(1234567), '1 234 567')
    strictEqual(thousands(12345678), '12 345 678')
    strictEqual(thousands(21000000), '21 000 000')
    strictEqual(thousands(100000000), '100 000 000')
  })
})
