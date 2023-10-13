import Clipboard from '@react-native-clipboard/clipboard'
import { Bubble } from '../../../../../components/bubble'
import { useNavigation } from '../../../../../hooks'

type Props = { id: string; showInfo?: boolean } & ComponentProps

export const UserId = ({ id, showInfo = false, style }: Props) => {
  const peachId = `Peach${id.slice(0, 8)}`
  const navigation = useNavigation()
  const goToUserProfile = () => navigation.navigate('publicProfile', { userId: id })
  const copy = () => Clipboard.setString(peachId)

  return (
    <Bubble
      style={style}
      color="primary-mild"
      iconSize={12}
      iconId={showInfo ? 'info' : 'copy'}
      onPress={showInfo ? goToUserProfile : copy}
    >
      {peachId}
    </Bubble>
  )
}
