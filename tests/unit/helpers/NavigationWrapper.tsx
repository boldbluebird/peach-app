import { NavigationContext } from '@react-navigation/native'

export const navigateMock = jest.fn()
export const replaceMock = jest.fn()
export const resetMock = jest.fn()
export const pushMock = jest.fn()
export const setParamsMock = jest.fn()
export const goBackMock = jest.fn()
export const canGoBackMock = jest.fn()
export const isFocusedMock = jest.fn().mockReturnValue(true)
export const unsubScribeMock = jest.fn()
export const addListenerMock = jest.fn(() => unsubScribeMock)
export let headerState: Record<'header', () => JSX.Element> = {
  header: () => <></>,
}
export const setOptionsMock = jest.fn((options) => {
  headerState = options
})
const getStateMock = jest.fn(() => ({
  routes: [
    {
      name: 'origin',
    },
    {
      name: 'meetupScreen',
    },
  ],
}))

export const NavigationWrapper = ({ children }: any) => (
  <NavigationContext.Provider
    value={{
      navigate: navigateMock,
      reset: resetMock,
      setOptions: setOptionsMock,
      // @ts-ignore
      replace: replaceMock,
      push: pushMock,
      setParams: setParamsMock,
      goBack: goBackMock,
      canGoBack: canGoBackMock,
      isFocused: isFocusedMock,
      addListener: addListenerMock,
      // @ts-ignore
      getState: getStateMock,
    }}
  >
    {children}
  </NavigationContext.Provider>
)
