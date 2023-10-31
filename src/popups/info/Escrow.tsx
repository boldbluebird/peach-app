import { View } from 'react-native'
import { Icon } from '../../components/Icon'
import { ParsedPeachText } from '../../components/text/ParsedPeachText'
import { PeachText } from '../../components/text/Text'
import tw from '../../styles/tailwind'
import i18n, { languageState } from '../../utils/i18n'
import { getLocalizedLink } from '../../utils/web'
import { openURL } from '../../utils/web/openURL'

const goToEscrowInfo = () => openURL(getLocalizedLink('terms-and-conditions', languageState.locale))

export const Escrow = () => (
  <>
    <ParsedPeachText
      parse={[
        {
          pattern: new RegExp(i18n('help.escrow.description.link'), 'u'),
          style: tw`underline`,
          onPress: goToEscrowInfo,
        },
      ]}
    >
      {i18n('help.escrow.description')}
    </ParsedPeachText>
    <View style={tw`flex-row gap-3 items-center  mt-4`}>
      <Icon id="info" style={tw`w-8 h-8`} color={tw`text-black-1`.color} />
      <PeachText style={tw`flex-shrink`}>{i18n('help.escrow.description.proTip')}</PeachText>
    </View>
  </>
)
