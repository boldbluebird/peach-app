import { TradeInformation } from './TradeInformation'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../views/contract/context', () => ({
  useContractContext: () => ({
    contract: {},
    view: 'buyer',
  }),
}))

const shouldShowTradeStatusInfoMock = jest.fn(() => true)
jest.mock('./shouldShowTradeStatusInfo', () => ({
  shouldShowTradeStatusInfo: jest.fn((..._args: any) => shouldShowTradeStatusInfoMock()),
}))

describe('TradeInformation', () => {
  const renderer = createRenderer()
  it('renders correctly with TradeStatusInfo', () => {
    renderer.render(<TradeInformation />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly if TradeStatusInfo should not be shown', () => {
    shouldShowTradeStatusInfoMock.mockReturnValueOnce(false)
    renderer.render(<TradeInformation />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
