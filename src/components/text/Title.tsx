import React, { ReactElement, ReactNode, useContext } from 'react'
import { Pressable, View } from 'react-native'
import Icon from '../Icon'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { OverlayContext } from '../../contexts/overlay'
import { Text } from '.'

type TitleProps = ComponentProps & {
  title: string,
  subtitle?: string,
  help?: ReactNode
}

export const Title = ({ title, subtitle, help, style }: TitleProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const openHelp = () => updateOverlay({ content: help, showCloseButton: true, help: true })

  return <View style={[tw`flex items-center`, style]}>
    <Text style={[
      tw`font-baloo text-center text-2xl leading-2xl uppercase text-peach-1`,
      tw.md`text-3xl leading-3xl`,
    ]}>
      {title}
    </Text>
    {subtitle
      ? <View style={tw`flex-row justify-center items-center -mt-3`}>
        <Text style={tw`text-center leading-6 text-grey-2 `}>
          {i18n(subtitle)}
        </Text>
        {help
          ? <Pressable style={tw`w-0 ml-1 mt-0.5`}
            onPress={openHelp}>
            <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
          </Pressable>
          : null
        }
      </View>
      : null
    }
  </View>
}

export default Title