import { TouchableOpacity, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Icon, Loading, Placeholder, Text } from '../../../components'
import { BTCAmount } from '../../../components/bitcoin'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useWalletState } from '../../../utils/wallet/walletStore'

type Props = {
  amount: number
  isRefreshing?: boolean
}
export const TotalBalance = ({ amount, isRefreshing }: Props) => {
  const [showBalance, toggleShowBalance] = useWalletState(
    (state) => [state.showBalance, state.toggleShowBalance],
    shallow,
  )

  return (
    <View style={tw`items-center self-stretch gap-4`}>
      <View style={[tw`flex-row items-center self-stretch justify-center gap-14px`, isRefreshing && tw`opacity-50`]}>
        <Placeholder style={tw`w-5 h-5`} />
        <Text style={tw`text-center button-medium`}>{i18n('wallet.totalBalance')}:</Text>
        <TouchableOpacity
          accessibilityHint={i18n(showBalance ? 'wallet.hideBalance' : 'wallet.showBalance')}
          onPress={toggleShowBalance}
        >
          <Icon id={showBalance ? 'eyeOff' : 'eye'} size={20} color={tw`text-black-3`.color} />
        </TouchableOpacity>
      </View>
      {isRefreshing && <Loading style={tw`w-16 h-16 absolute`} />}
      <BTCAmount amount={amount} size="extra large" showAmount={showBalance} style={isRefreshing && tw`opacity-50`} />
    </View>
  )
}
