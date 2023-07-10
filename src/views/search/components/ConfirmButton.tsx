import { PrimaryButton } from '../../../components'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useConfirmPremium } from '../hooks'

type Props = {
  offerId: string
  newPremium: number
}
export const ConfirmButton = ({ offerId, newPremium }: Props) => {
  const { mutate: confirmPremium } = useConfirmPremium(offerId, newPremium)
  const navigation = useNavigation()
  return (
    <PrimaryButton
      onPress={() => confirmPremium(undefined, { onSuccess: navigation.goBack })}
      style={tw`self-center mb-5`}
      narrow
    >
      {i18n('confirm')}
    </PrimaryButton>
  )
}
