import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Checkbox } from '../../../components'
import { NumberStepper } from '../../../components/inputs/NumberStepper'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

const FUND_MULTI_MIN = 3

export const FundMultipleOffers = () => {
  const [multi, setMulti] = useOfferPreferences((state) => [state.multi, state.setMulti], shallow)
  const toggleFundMultiple = () => setMulti(multi ? undefined : FUND_MULTI_MIN)

  return (
    <View style={tw`gap-3`}>
      <Checkbox checked={!!multi} text={i18n('offer.fundMultiple')} onPress={toggleFundMultiple} />
      {!!multi && <NumberStepper value={multi} onChange={setMulti} min={FUND_MULTI_MIN} max={10} />}
    </View>
  )
}
