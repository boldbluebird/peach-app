import { NETWORK } from '@env'
import { TouchableOpacity } from 'react-native-gesture-handler'
import tw from '../../../styles/tailwind'
import { showAddress, showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { Icon } from '../../../components/Icon'
import { Text } from '../../../components/text'

export const Escrow = ({ style }: ComponentProps) => {
  const { releaseTxId, escrow, disputeActive } = useContractContext().contract
  const openEscrow = () => (releaseTxId ? showTransaction(releaseTxId, NETWORK) : showAddress(escrow, NETWORK))

  return (
    <TouchableOpacity
      onPress={openEscrow}
      style={[
        tw`flex-row items-center justify-center px-2 border rounded-lg border-primary-main`,
        disputeActive && tw`border-error-light`,
        style,
      ]}
    >
      <Text style={[tw`button-medium text-primary-main`, disputeActive && tw`text-error-light`]}>{i18n('escrow')}</Text>
      <Icon
        id="externalLink"
        style={tw`w-3 h-3 ml-1 -mt-px`}
        color={disputeActive ? tw`text-error-light`.color : tw`text-primary-main`.color}
      />
    </TouchableOpacity>
  )
}
