import { callWhenInternet } from './callWhenInternet'

const fetchMock = jest.fn().mockResolvedValue({ isInternetReachable: true })
const callbacks: Function[] = []
const unsubScribeMock = jest.fn()
const addEventListenerMock = jest.fn((cb: Function) => {
  callbacks.push(cb)
  return unsubScribeMock
})
jest.mock('@react-native-community/netinfo', () => ({
  fetch: () => fetchMock(),
  addEventListener: (cb: Function) => addEventListenerMock(cb),
}))

describe('callWhenInternet', () => {
  const callback = jest.fn()
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should run callback when connected to the internet', async () => {
    await callWhenInternet(callback)

    expect(callback).toHaveBeenCalled()
  })
  it('should not run callback immediately when not connected to the internet', async () => {
    fetchMock.mockResolvedValue({ isInternetReachable: false })
    await callWhenInternet(callback)

    expect(callback).not.toHaveBeenCalled()

    const connectedState = {
      isInternetReachable: true,
    }
    callbacks.map((cb) => cb(connectedState))
    expect(callback).toHaveBeenCalled()
    expect(unsubScribeMock).toHaveBeenCalled()
  })
  it('should not run callback at all when not connected to the internet', async () => {
    fetchMock.mockResolvedValue({ isInternetReachable: false })
    await callWhenInternet(callback)

    const connectedState = {
      isInternetReachable: false,
    }
    callbacks.map((cb) => cb(connectedState))
    expect(callback).not.toHaveBeenCalled()
    expect(unsubScribeMock).not.toHaveBeenCalled()
  })
})
