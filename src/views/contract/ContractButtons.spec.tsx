import { fireEvent, render } from 'test-utils'
import { contract } from '../../../peach-api/src/testData/contract'
import { Popup } from '../../components/popup'
import { ProvideEmailButton } from './ContractButtons'
import { ContractContext } from './context'

describe('ContractButtons - ProvideEmailButton', () => {
  it('should open the popup when pressed', () => {
    const { getByText } = render(
      <ContractContext.Provider
        value={{
          contract,
          view: 'buyer',
          isDecryptionError: false,
          showBatchInfo: false,
          toggleShowBatchInfo: jest.fn(),
        }}
      >
        <Popup />
        <ProvideEmailButton />
      </ContractContext.Provider>,
    )
    fireEvent.press(getByText('provide email'))

    expect(getByText('dispute opened')).toBeTruthy()
  })
})
