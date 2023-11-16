import { createStackNavigator } from '@react-navigation/stack'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { LogoIcons } from '../assets/logo'
import { PeachyGradient } from '../components/PeachyGradient'
import { useMessageState } from '../components/message/useMessageState'
import { useNavigation } from '../hooks'
import { initApp } from '../init/initApp'
import { requestUserPermissions } from '../init/requestUserPermissions'
import { VerifyYouAreAHumanPopup } from '../popups/warning/VerifyYouAreAHumanPopup'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import { useAccountStore } from '../utils/account/account'
import i18n from '../utils/i18n'
import { screenTransition } from '../utils/layout/screenTransition'
import { isIOS } from '../utils/system'
import { onboardingViews, views } from './views'

const Stack = createStackNavigator<RootStackParamList>()

export function Screens () {
  const [isLoading, setIsLoading] = useState(true)
  const isLoggedIn = useAccountStore((state) => !!state.account.publicKey)
  if (isLoading) return <SplashScreenComponent setIsLoading={setIsLoading} />

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: isIOS(),
        headerShown: false,
      }}
    >
      {(isLoggedIn ? views : onboardingViews).map(({ name, component, animationEnabled }) => (
        <Stack.Screen
          {...{ name, component }}
          key={name}
          options={{
            animationEnabled,
            cardStyle: tw`bg-primary-background`,
            transitionSpec: {
              open: screenTransition,
              close: screenTransition,
            },
          }}
        />
      ))}
    </Stack.Navigator>
  )
}

function SplashScreenComponent ({ setIsLoading }: { setIsLoading: (isLoading: boolean) => void }) {
  const updateMessage = useMessageState((state) => state.updateMessage)
  const navigation = useNavigation()
  const setPopup = usePopupStore((state) => state.setPopup)
  useEffect(() => {
    (async () => {
      const statusResponse = await initApp()

      if (!statusResponse || statusResponse.error) {
        if (statusResponse?.error === 'HUMAN_VERIFICATION_REQUIRED') {
          setPopup(<VerifyYouAreAHumanPopup />)
        } else {
          updateMessage({
            msgKey: statusResponse?.error || 'NETWORK_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
        }
      }
      requestUserPermissions()
      setIsLoading(false)
      SplashScreen.hide()
    })()
  }, [navigation, setIsLoading, setPopup, updateMessage])

  return (
    <View>
      <PeachyGradient />
      <View style={tw`w-full h-full absolute items-center justify-center`}>
        <LogoIcons.fullLogo style={tw``} />
      </View>
    </View>
  )
}
