import { TouchableOpacity } from 'react-native'
import { Icon, Text } from '../'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useAddPaymentMethodButtonSetup } from './hooks/useAddPaymentMethodButtonSetup'

type Props = ComponentProps & {
  isCash: boolean
}

export const AddPaymentMethodButton = ({ isCash, style }: Props) => {
  const { addCashPaymentMethods, addPaymentMethods, isLoading } = useAddPaymentMethodButtonSetup()

  return (
    <TouchableOpacity
      onPress={isCash ? addCashPaymentMethods : addPaymentMethods}
      disabled={isCash && isLoading}
      style={[tw`flex-row items-center self-center`, style, isCash && isLoading && tw`opacity-50`]}
    >
      <Icon id="plusCircle" style={tw`mr-3 w-7 h-7`} color={tw`text-primary-main`.color} />
      <Text style={tw`h6 text-primary-main`}>{i18n(`paymentMethod.select.button.${isCash ? 'cash' : 'remote'}`)}</Text>
    </TouchableOpacity>
  )
}
