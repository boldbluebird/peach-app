/* eslint-disable max-lines */
import { ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { Animated, Dimensions, SafeAreaView, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import analytics from '@react-native-firebase/analytics'
import { DefaultTheme, NavigationContainer, NavigationState, useNavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import RNRestart from 'react-native-restart'
import { enableScreens } from 'react-native-screens'

import { AvoidKeyboard, Footer, Header, Drawer, Message, Overlay } from './components'
import tw from './styles/tailwind'
import i18n from './utils/i18n'
import { getViews } from './views'

import { DrawerContext, getDrawer, setDrawer } from './contexts/drawer'
import LanguageContext from './contexts/language'
import { MessageContext, getMessage, setMessage, showMessageEffect } from './contexts/message'
import { OverlayContext, defaultOverlay, useOverlay, useOverlayContext } from './contexts/overlay'
import { PeachWSContext, getWebSocket, setPeachWS } from './utils/peachAPI/websocket'

import { DEV } from '@env'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { shallow } from 'zustand/shallow'
import { Background } from './components/background/Background'
import { ISEMULATOR, TIMETORESTART } from './constants'
import appStateEffect from './effects/appStateEffect'
import { useUpdateTradingAmounts } from './hooks'
import { useMessageHandler } from './hooks/notifications/useMessageHandler'
import { useHandleNotifications } from './hooks/notifications/usePushHandleNotifications'
import { useCheckTradeNotifications } from './hooks/useCheckTradeNotifications'
import { getPeachInfo } from './init/getPeachInfo'
import { getTrades } from './init/getTrades'
import { initApp } from './init/initApp'
import { initialNavigation } from './init/initialNavigation'
import requestUserPermissions from './init/requestUserPermissions'
import websocket from './init/websocket'
import { useShowAnalyticsPrompt } from './overlays/useShowAnalyticsPrompt'
import { useBitcoinStore } from './store/bitcoinStore'
import { useSettingsStore } from './store/settingsStore'
import { account } from './utils/account'
import { screenTransition } from './utils/layout/screenTransition'
import { error, info } from './utils/log'
import { marketPrices } from './utils/peachAPI/public/market'
import { parseError } from './utils/result'
import { isIOS, isNetworkError } from './utils/system'
import { useShowUpdateAvailable } from './hooks/useShowUpdateAvailable'

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
}

const queryClient = new QueryClient()

let goHomeTimeout: NodeJS.Timer

type HandlerProps = {
  getCurrentPage: () => keyof RootStackParamList | undefined
}
const Handlers = ({ getCurrentPage }: HandlerProps): ReactElement => {
  const messageHandler = useMessageHandler(getCurrentPage)
  const [, updateOverlay] = useOverlayContext()
  const showAnalyticsPrompt = useShowAnalyticsPrompt(updateOverlay)
  const analyticsPopupSeen = useSettingsStore((state) => state.analyticsPopupSeen)

  useShowUpdateAvailable()

  useEffect(() => {
    if (!analyticsPopupSeen) showAnalyticsPrompt()
  }, [analyticsPopupSeen, showAnalyticsPrompt])

  useHandleNotifications(messageHandler)

  return <></>
}
const usePartialAppSetup = () => {
  const [active, setActive] = useState(true)
  const updateTradingAmounts = useUpdateTradingAmounts()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)
  const [setPrices, setCurrency] = useBitcoinStore((state) => [state.setPrices, state.setCurrency], shallow)
  useCheckTradeNotifications()

  useEffect(
    appStateEffect({
      callback: (isActive) => {
        setActive(isActive)
        if (isActive) {
          getPeachInfo()
          if (account?.publicKey) {
            getTrades()
          }
          analytics().logAppOpen()

          clearTimeout(goHomeTimeout)
        } else {
          goHomeTimeout = setTimeout(() => RNRestart.Restart(), TIMETORESTART)
        }
      },
    }),
    [],
  )

  useEffect(() => {
    if (!active) return () => {}

    const checkingInterval = 15 * 1000
    const checkingFunction = async () => {
      const [prices] = await marketPrices({ timeout: checkingInterval })
      if (prices) setPrices(prices)
      if (prices?.CHF) updateTradingAmounts(prices.CHF)
    }
    const interval = setInterval(checkingFunction, checkingInterval)
    setCurrency(displayCurrency)
    checkingFunction()

    return () => {
      clearInterval(interval)
    }
  }, [active, displayCurrency, setCurrency, setPrices, updateTradingAmounts])
}

// eslint-disable-next-line max-statements
const App = () => {
  const [messageState, updateMessage] = useReducer(setMessage, getMessage())
  const [
    { title: drawerTitle, content: drawerContent, show: showDrawer, previousDrawer, onClose: onCloseDrawer },
    updateDrawer,
  ] = useReducer(setDrawer, getDrawer())
  const [overlayState, updateOverlay] = useOverlay()
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const { width } = Dimensions.get('window')
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef()

  const [currentPage, setCurrentPage] = useState<keyof RootStackParamList>()
  const getCurrentPage = useCallback(() => currentPage, [currentPage])
  const views = getViews(!!account?.publicKey)
  const showFooter = !!views.find((v) => v.name === currentPage)?.showFooter
  const backgroundConfig = views.find((v) => v.name === currentPage)?.background

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({
      msgKey: err.message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigationRef.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    const errorMessage = parseError(err)
    const msgKey = isNetworkError(errorMessage) ? 'NETWORK_ERROR' : errorMessage
    updateMessage({
      msgKey: msgKey || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigationRef.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  useEffect(showMessageEffect(messageState.msgKey, width, slideInAnim), [messageState.msgKey, messageState.time])

  useEffect(() => {
    if (DEV !== 'true' && ISEMULATOR) {
      error(new Error('NO_EMULATOR'))
      updateMessage({ msgKey: 'NO_EMULATOR', level: 'ERROR' })

      return
    }

    ;(async () => {
      const statusResponse = await initApp()
      if (!statusResponse || statusResponse.error) {
        updateMessage({
          msgKey: statusResponse?.error || 'NETWORK_ERROR',
          level: 'ERROR',
          action: {
            callback: () => navigationRef.navigate('contact'),
            label: i18n('contactUs'),
            icon: 'mail',
          },
        })
      }
      setCurrentPage(!!account?.publicKey ? 'home' : 'welcome')
      await initialNavigation(navigationRef, updateMessage)
      requestUserPermissions()
    })()
  }, [])

  useEffect(websocket(updatePeachWS, updateMessage), [])
  usePartialAppSetup()

  useEffect(() => {
    analytics().logAppOpen()
  }, [])

  const onNavStateChange = (state: NavigationState | undefined) => {
    if (state) setCurrentPage(state.routes[state.routes.length - 1].name as keyof RootStackParamList)
  }

  useEffect(() => {
    info('Navigation event', currentPage)
    // Disable OS back button
    analytics().logScreenView({
      screen_name: currentPage as string,
    })
  }, [currentPage])

  if (!currentPage) return null

  return (
    <GestureHandlerRootView>
      <AvoidKeyboard>
        <QueryClientProvider client={queryClient}>
          <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
            <PeachWSContext.Provider value={peachWS}>
              <MessageContext.Provider value={[messageState, updateMessage]}>
                <DrawerContext.Provider
                  value={[
                    { title: '', content: null, show: false, previousDrawer: {}, onClose: () => {} },
                    updateDrawer,
                  ]}
                >
                  <OverlayContext.Provider value={[defaultOverlay, updateOverlay]}>
                    <NavigationContainer theme={navTheme} ref={navigationRef} onStateChange={onNavStateChange}>
                      <Handlers {...{ getCurrentPage }} />
                      <Background config={backgroundConfig}>
                        <Drawer
                          title={drawerTitle}
                          content={drawerContent}
                          show={showDrawer}
                          onClose={onCloseDrawer}
                          previousDrawer={previousDrawer}
                        />
                        <Overlay {...overlayState} />
                        <SafeAreaView>
                          <View style={tw`flex-col h-full`}>
                            {!!messageState.msgKey && (
                              <Animated.View style={[tw`absolute z-20 w-full`, { top: slideInAnim }]}>
                                <Message {...messageState} />
                              </Animated.View>
                            )}
                            <View style={tw`flex-shrink h-full`}>
                              <Stack.Navigator
                                detachInactiveScreens={true}
                                screenOptions={{
                                  gestureEnabled: isIOS(),
                                  headerShown: false,
                                }}
                              >
                                {views.map(({ name, component, showHeader, background, animationEnabled }) => (
                                  <Stack.Screen
                                    {...{ name, component }}
                                    key={name}
                                    options={{
                                      headerShown: showHeader,
                                      header: () => <Header />,
                                      animationEnabled: isIOS() && animationEnabled,
                                      cardStyle: !background.color && tw`bg-primary-background`,
                                      transitionSpec: {
                                        open: screenTransition,
                                        close: screenTransition,
                                      },
                                    }}
                                  />
                                ))}
                              </Stack.Navigator>
                            </View>
                            {showFooter && (
                              <Footer
                                style={tw`z-10`}
                                active={currentPage}
                                setCurrentPage={setCurrentPage}
                                theme={backgroundConfig?.color === 'primaryGradient' ? 'inverted' : 'default'}
                              />
                            )}
                          </View>
                        </SafeAreaView>
                      </Background>
                    </NavigationContainer>
                  </OverlayContext.Provider>
                </DrawerContext.Provider>
              </MessageContext.Provider>
            </PeachWSContext.Provider>
          </LanguageContext.Provider>
        </QueryClientProvider>
      </AvoidKeyboard>
    </GestureHandlerRootView>
  )
}
export default App
