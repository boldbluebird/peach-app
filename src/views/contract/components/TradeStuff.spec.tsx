import { TradeStuff } from './TradeStuff'
import { createRenderer } from 'react-test-renderer/shallow'

const useContractContextMock = jest.fn()
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('TradeStuff', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    useContractContextMock.mockReturnValueOnce({
      contract: {
        paymentMethod: 'sepa',
        escrow: '0x123',
        releaseTxId: '0x123',
        disputeActive: false,
      } as Contract,
    })
    renderer.render(<TradeStuff />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when the paymentmethod includes cash', () => {
    useContractContextMock.mockReturnValueOnce({
      contract: {
        paymentMethod: 'cash.DE',
        escrow: '0x123',
        releaseTxId: '0x123',
        disputeActive: false,
      } as unknown as Contract,
    })
    renderer.render(<TradeStuff />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('doesn\'t show the escrow when the releaseTxId and the escrow are not set', () => {
    useContractContextMock.mockReturnValueOnce({
      contract: {
        paymentMethod: 'sepa',
        escrow: '',
        releaseTxId: undefined,
        disputeActive: false,
      } as Contract,
    })
    renderer.render(<TradeStuff />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
