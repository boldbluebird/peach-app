import { fireEvent, render, renderHook, waitFor } from 'test-utils'
import { account1 } from '../../tests/unit/data/accountData'
import { buyOffer } from '../../tests/unit/data/offerData'
import { GrayPopup } from '../popups/GrayPopup'
import { ClosePopupAction } from '../popups/actions'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import { updateAccount } from '../utils/account/updateAccount'
import i18n from '../utils/i18n'
import { useCancelOffer } from './useCancelOffer'

const saveOfferMock = jest.fn()
jest.mock('../utils/offer/saveOffer', () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
}))

describe('useCancelOffer', () => {
  beforeEach(() => {
    updateAccount(account1)
  })
  it('should show cancel offer popup', () => {
    const { result } = renderHook(useCancelOffer, { initialProps: buyOffer.id })
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { toJSON } = render(popupComponent)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show cancel offer confirmation popup', async () => {
    const { result } = renderHook(useCancelOffer, { initialProps: buyOffer.id })
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getAllByText } = render(popupComponent)
    fireEvent.press(getAllByText('cancel offer')[1])

    await waitFor(() => {
      const cancelPopup = usePopupStore.getState().popupComponent
      expect(cancelPopup).toStrictEqual(
        <GrayPopup
          title={i18n('offer.canceled.popup.title')}
          actions={<ClosePopupAction style={tw`justify-center`} />}
        />,
      )
    })
  })
})
