import { useCallback, useEffect } from 'react'
import { Linking } from 'react-native'
import 'react-native-url-polyfill/auto'
import { account } from '../utils/account'
import { useNavigation } from './useNavigation'

export const useDynamicLinks = () => {
  const navigation = useNavigation()

  const handleReferralCode = useCallback(
    ({ url: initialURL }: { url: string | null }) => {
      if (!initialURL) return
      const link = new URL(initialURL).searchParams.get('link')

      if (!link) return
      const url = link

      if (!url.includes('/referral')) return

      const referralCode = new URL(url).searchParams.get('code')
      if (referralCode && !account.publicKey) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'welcome', params: { referralCode } }],
        })
      }
    },
    [navigation],
  )

  useEffect(() => {
    const listener = Linking.addEventListener('url', handleReferralCode)
    Linking.getInitialURL().then((url) => handleReferralCode({ url }))
    return () => listener.remove()
  }, [handleReferralCode])

  return handleReferralCode
}
