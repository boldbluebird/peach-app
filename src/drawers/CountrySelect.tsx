import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Flag, HorizontalLine, Text } from '../components'
import { FlagType } from '../components/flags'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

type CountryProps = {
  countries: FlagType[]
  selectedCountry?: FlagType
  onSelect: (country: FlagType) => void
}
export const CountrySelect = ({ countries, onSelect }: CountryProps): ReactElement => (
  <View>
    {countries.map((country, i) => (
      <Pressable onPress={() => onSelect(country)}>
        <View key={country}>
          <View style={tw`flex flex-row items-center px-8`}>
            <Flag id={country} style={tw`w-8 h-8 mr-4 overflow-hidden`} />
            <Text style={tw`flex-shrink w-full subtitle-1`}>{i18n(`country.${country}`).toLowerCase()}</Text>
          </View>
          {i < countries.length - 1 ? <HorizontalLine style={tw`my-6`} /> : null}
        </View>
      </Pressable>
    ))}
  </View>
)
