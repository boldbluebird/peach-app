import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { defaultFundingStatus } from '../../utils/offer/constants'
import { FundEscrow } from './FundEscrow'

const useFundEscrowSetupMock = jest.fn()
jest.mock('./hooks/useFundEscrowSetup', () => ({
  useFundEscrowSetup: () => useFundEscrowSetupMock(),
}))
const useFundFromPeachWalletMock = jest.fn().mockReturnValue({
  fundFromPeachWallet: jest.fn(),
  fundedFromPeachWallet: false,
})
jest.mock('./hooks/useFundFromPeachWallet', () => ({
  useFundFromPeachWallet: () => useFundFromPeachWalletMock(),
}))

describe('FundEscrow', () => {
  const defaultReturnValue = {
    offerId: sellOffer.id,
    offer: sellOffer,
    fundingAddress: sellOffer.returnAddress,
    fundingAddresses: [],
    fundingStatus: defaultFundingStatus,
    fundingAmount: 100000,
    createEscrowError: null,
  }
  const renderer = createRenderer()

  it('should render the FundEscrow view', () => {
    useFundEscrowSetupMock.mockReturnValueOnce(defaultReturnValue)
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should show Loading, while escrow is not defined', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      fundingAddress: undefined,
    })
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('should show funded from peach wallet, if funded from peach wallet', () => {
    useFundEscrowSetupMock.mockReturnValueOnce(defaultReturnValue)
    useFundFromPeachWalletMock.mockReturnValueOnce({
      fundFromPeachWallet: jest.fn(),
      fundedFromPeachWallet: true,
    })
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should show TransactionInMempool, if fundingStatus is MEMPOOL', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      fundingStatus: {
        ...defaultFundingStatus,
        status: 'MEMPOOL',
        txIds: ['txId'],
      },
    })
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
