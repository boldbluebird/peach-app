import { linkToAppStore } from './linkToAppStore'
import { linkToAppStoreAndroid } from './linkToAppStoreAndroid'
import { linkToAppStoreIOS } from './linkToAppStoreIOS'
import { isIOS } from './isIOS'

jest.mock('./linkToAppStoreAndroid')
jest.mock('./linkToAppStoreIOS')
jest.mock('./isIOS')

describe('linkToAppStore', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('calls linkToAppStoreIOS if isIOS returns true', () => {
    (<jest.Mock>isIOS).mockReturnValueOnce(true)
    linkToAppStore()
    expect(linkToAppStoreIOS).toHaveBeenCalled()
    expect(linkToAppStoreAndroid).not.toHaveBeenCalled()
  })

  it('calls linkToAppStoreAndroid if isIOS returns false', () => {
    (<jest.Mock>isIOS).mockReturnValueOnce(false)
    linkToAppStore()
    expect(linkToAppStoreAndroid).toHaveBeenCalled()
    expect(linkToAppStoreIOS).not.toHaveBeenCalled()
  })
})
