import { defaultAccount, setAccount } from '..'
import { chatStorage } from '../chatStorage'
import { storeChat } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('storeChat', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('would store chats', () => {
    storeChat(accountData.buyer.chats['313-312'])
    expect(chatStorage.setMap).toHaveBeenCalledWith('313-312', accountData.buyer.chats['313-312'])
  })
})
