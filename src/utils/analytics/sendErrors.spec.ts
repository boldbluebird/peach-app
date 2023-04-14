import { sendErrors } from '.'
import { appendFile } from '../file'
import crashlytics from '@react-native-firebase/crashlytics'

jest.mock('../file', () => ({
  appendFile: jest.fn(),
}))

describe('sendErrors function', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  const isAirplaneModeSync = jest.spyOn(require('react-native-device-info'), 'isAirplaneModeSync')
  it('should append the error messages to a file when airplane mode is enabled', async () => {
    isAirplaneModeSync.mockReturnValueOnce(true)
    const errors = [new Error('error 1'), new Error('error 2')]

    await sendErrors(errors)

    expect(appendFile as jest.Mock).toHaveBeenCalledWith('/error.log', 'error 1\nerror 2', true)
    expect(crashlytics().recordError).not.toHaveBeenCalled()
  })

  it('should send crash reports to Crashlytics when airplane mode is not enabled', async () => {
    isAirplaneModeSync.mockReturnValueOnce(false)
    const errors = [new Error('error 1'), new Error('error 2')]

    await sendErrors(errors)

    expect((appendFile as jest.Mock).mock.calls.length).toBe(0)
    expect(crashlytics().recordError).toHaveBeenCalledTimes(2)
    expect(crashlytics().recordError).toHaveBeenCalledWith(errors[0])
    expect(crashlytics().recordError).toHaveBeenCalledWith(errors[1])
  })
})
