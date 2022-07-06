import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Dropdown, Headline, Icon, SatsFormat, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { BUCKETS } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import { BuyViewProps } from './Buy'
import { getTradingLimit, updateSettings } from '../../utils/account'
import { applyTradingLimit } from '../../utils/account/tradingLimit'
import Sats from '../../overlays/info/Sats'
import { OverlayContext } from '../../contexts/overlay'

export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [{ currency, satsPerUnit, prices }] = useContext(BitcoinContext)
  const [amount, setAmount] = useState(offer.amount)

  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    updateOffer({ ...offer, amount })
    updateSettings({ amount }, true)
    setStepValid(true)
  }, [amount])

  useEffect(() => {
    setStepValid(true)
  }, [])

  const onChange = (value: string|number) => setAmount(value as number)
  const onToggle = (isOpen: boolean) => setDropdownOpen(isOpen)

  const dropdownItems = applyTradingLimit(BUCKETS, prices.CHF as number, getTradingLimit()).map(value => ({
    value,
    display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
      <SatsFormat sats={value} format="big"/>
      {isOpen && satsPerUnit
        ? <Text style={tw`font-mono text-peach-1`}>
          {i18n(`currency.format.${currency}`, String(Math.round(value / satsPerUnit)))}
        </Text>
        : null
      }
    </View>
  }))

  const openSatsHelp = () => updateOverlay({ content: <Sats view="buyer" />, showCloseButton: true, help: true })

  return <View style={tw`h-full flex`}>
    <Title title={i18n('buy.title')} />
    <View style={tw`h-full flex-shrink flex justify-center`}>
      <View>
        <Headline style={tw`mt-16 text-grey-1 px-5`}>
          {i18n('buy.subtitle')}
        </Headline>
        <View style={tw`z-10`}>
          <View style={tw`w-full absolute flex-row items-center justify-center mt-3`}>
            <Dropdown
              testID="buy-amount"
              style={tw`max-w-xs flex-shrink`}
              items={dropdownItems}
              selectedValue={amount}
              onChange={onChange} onToggle={onToggle}
            />
            <Pressable onPress={openSatsHelp}>
              <Icon id="help" style={tw`ml-2 w-5 h-5`} color={tw`text-blue-1`.color as string} />
            </Pressable>
          </View>
        </View>
        {satsPerUnit
          ? <Text style={tw`mt-4 mt-16 font-mono text-peach-1 text-center`}>
            ≈ {i18n(`currency.format.${currency}`, String(Math.round(amount / satsPerUnit)))}
          </Text>
          : null
        }
      </View>
    </View>
  </View>
}