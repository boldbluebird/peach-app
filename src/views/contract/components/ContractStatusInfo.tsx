import { View } from 'react-native'
import { Icon, Text, Timer } from '../../../components'
import tw from '../../../styles/tailwind'
import { getPaymentExpectedBy } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { shouldShowConfirmCancelTradeRequest } from '../../../utils/overlay'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { useContractContext } from '../context'

type ContractStatusInfoProps = {
  requiredAction: ContractAction
}
export const ContractStatusInfo = ({ requiredAction }: ContractStatusInfoProps) => {
  const { contract, view } = useContractContext()

  if (contract.disputeActive || shouldShowConfirmCancelTradeRequest(contract, view) || contract.cancelationRequested) {
    return <></>
  }

  if (requiredAction === 'sendPayment' && !isCashTrade(contract.paymentMethod)) {
    const paymentExpectedBy = getPaymentExpectedBy(contract)
    if (Date.now() < paymentExpectedBy) {
      return <Timer text={i18n(`contract.timer.${requiredAction}.${view}`)} end={paymentExpectedBy} />
    }
    return (
      <View style={tw`flex-row items-center`}>
        <Text style={tw`uppercase button-medium`}>{i18n('contract.timer.paymentTimeExpired.buyer')}</Text>
        <Icon id={'clock'} style={tw`w-5 h-5 ml-1`} />
      </View>
    )
  }
  if (view === 'buyer' && requiredAction === 'confirmPayment') return (
    <View style={tw`flex-row items-center justify-center`}>
      <Text style={tw`text-center button-medium`}>{i18n('contract.timer.confirmPayment.buyer')}</Text>
    </View>
  )
  if (view === 'seller' && requiredAction === 'confirmPayment') return (
    <View style={tw`flex-row items-center justify-center`}>
      <Text style={tw`text-center button-medium`}>{i18n('contract.timer.confirmPayment.seller')}</Text>
      <Icon id="check" style={tw`w-5 h-5 ml-1 -mt-0.5`} color={tw`text-success-main`.color} />
    </View>
  )
  return <></>
}
