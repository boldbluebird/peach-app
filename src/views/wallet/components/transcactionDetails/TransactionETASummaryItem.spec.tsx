import { fireEvent, render } from 'test-utils'
import { feeEstimates } from '../../../../../tests/unit/data/electrumData'
import { pending1 } from '../../../../../tests/unit/data/transactionDetailData'
import { Popup } from '../../../../components/popup/Popup'
import { placeholderFeeEstimates } from '../../../../hooks/query/useFeeEstimates'
import { TransactionETASummaryItem } from './TransactionETASummaryItem'

const useFeeEstimatesMock = jest.fn().mockReturnValue({ feeEstimates: placeholderFeeEstimates })
jest.mock('../../../../hooks/query/useFeeEstimates', () => ({
  ...jest.requireActual('../../../../hooks/query/useFeeEstimates'),
  useFeeEstimates: () => useFeeEstimatesMock(),
}))

const useTxFeeRateMock = jest.fn().mockReturnValue(2)
jest.mock('../../hooks/useTxFeeRate', () => ({
  useTxFeeRate: (...args: unknown[]) => useTxFeeRateMock(...args),
}))

describe('TransactionETA', () => {
  it('should render correctly for 1 block ETA', () => {
    const { toJSON } = render(<TransactionETASummaryItem transaction={pending1} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for more than 1 block ETA', () => {
    useFeeEstimatesMock.mockReturnValueOnce({ feeEstimates })

    const { toJSON } = render(<TransactionETASummaryItem transaction={pending1} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should open help popup', () => {
    const { getByText } = render(
      <>
        <TransactionETASummaryItem transaction={pending1} />
        <Popup />
      </>,
    )
    fireEvent.press(getByText('in 1 block'))
    expect(getByText('confirmation time')).toBeTruthy()
  })
})
