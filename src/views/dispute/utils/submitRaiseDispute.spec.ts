import { contract } from '../../../../tests/unit/data/contractData'
import { account } from '../../../utils/account'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { submitRaiseDispute } from './submitRaiseDispute'

const raiseDisputeMock = jest.fn()
jest.mock('../../../utils/peachAPI', () => ({
  raiseDispute: (...args: any) => raiseDisputeMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('submitRaiseDispute', () => {
  const mockContract = { ...contract }
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should return [false, null] if contract is undefined', async () => {
    const [result, err] = await submitRaiseDispute(undefined, 'noPayment.buyer')
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, null] if contract.symmetricKey is undefined', async () => {
    const [result, err] = await submitRaiseDispute({ ...mockContract, symmetricKey: undefined }, 'noPayment.buyer')
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, null] if raiseDispute returns no result and no error', async () => {
    raiseDisputeMock.mockResolvedValue([null, null])
    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.buyer')
    expect(result).toBe(false)
    expect(err).toBe(null)
  })
  it('should return [false, error] if raiseDispute returns no result and an error', async () => {
    raiseDisputeMock.mockResolvedValue([null, 'error'])
    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.buyer')
    expect(result).toBe(false)
    expect(err).toBe('error')
  })
  it('should return [true, null] if raiseDispute returns a result and no error', async () => {
    raiseDisputeMock.mockResolvedValue([{}, null])
    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.buyer')
    expect(result).toBe(true)
    expect(err).toBe(null)
  })
  it('should save chat', async () => {
    raiseDisputeMock.mockResolvedValue([{}, null])

    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.buyer')
    expect(result).toBe(true)
    expect(err).toBe(null)
    expect(account.chats[mockContract.id]).toEqual({
      draftMessage: '',
      id: '14-15',
      lastSeen: new Date(0),
      messages: [],
      seenDisputeDisclaimer: false,
    })
  })
  it('should save chat with autogenerated messages', async () => {
    const disputeDate = new Date('2021-01-09')
    jest.spyOn(Date, 'now').mockImplementation(() => disputeDate.getTime())
    account.publicKey = 'buyer'
    const contractInDispute = {
      ...mockContract,
      disputeDate,
      disputeInitiator: account.publicKey,
      seller: {
        ...mockContract.seller,
        id: account.publicKey,
      },
      disputeReason: 'noPayment.seller',
    }
    const roomId = contractInDispute.id
    raiseDisputeMock.mockResolvedValue([contractInDispute, null])

    const reason = i18n(`dispute.reason.${contractInDispute.disputeReason}`)
    const defaultMessage = {
      roomId,
      from: 'system',
      date: disputeDate,
      readBy: [account.publicKey],
      signature: expect.any(String),
    }
    const [result, err] = await submitRaiseDispute(mockContract, 'noPayment.seller')
    expect(result).toBe(true)
    expect(err).toBe(null)
    expect(account.chats[mockContract.id].messages).toEqual([
      {
        ...defaultMessage,
        message: i18n(
          'chat.systemMessage.disputeStarted',
          i18n('buyer'),
          `Peach${account.publicKey.substring(0, 8)}`,
          reason,
        ),
      },
      {
        ...defaultMessage,
        message: i18n('chat.systemMessage.mediatorWillJoinSoon'),
      },
      {
        ...defaultMessage,
        message: [
          i18n('chat.systemMessage.provideMoreInformation.1'),
          i18n('chat.systemMessage.provideMoreInformation.2', contractIdToHex(contractInDispute.id)),
        ].join('\n\n'),
      },
    ])
  })
})
