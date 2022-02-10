import React, { ReactElement } from 'react'
import { Image, View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'

type BigTitle = {
  title: string,
}

export default ({ title }: BigTitle): ReactElement => <View style={tw`flex items-center`}>
  <Image source={require('../../../../assets/favico/peach-logo.png')} style={tw`w-40 h-40`}/>
  <Text style={tw`font-baloo text-center text-3xl leading-4xl uppercase text-peach-1 mt-3`}>
    {title}
  </Text>
</View>