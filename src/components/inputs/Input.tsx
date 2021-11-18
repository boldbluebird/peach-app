import React, { ReactElement } from 'react'
import {
  Pressable,
  View
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '..'
import { Shadow } from 'react-native-shadow-2'
import { innerShadow } from '../../utils/layoutUtils'

interface InputProps {
  value?: string,
  label?: string,
  icon?: string,
  autoCorrect?: boolean
  isValid?: boolean,
  errorMessage?: string[]
  onChange?: Function,
  onSubmit?: Function,
  secureTextEntry?: boolean
}

/**
 * @description Component to display an input field
 * @param props Component properties
 * @param [props.value] current value
 * @param [props.label] input label
 * @param [props.icon] icon id
 * @param [props.autoCorrect] if true, enable autocorrect on input field
 * @param [props.isValid] if true show valid state
 * @param [props.errorMessage] error message for invalid field
 * @param [props.onChange] onchange handler from outside
 * @param [props.onSubmit] onsubmit handler from outside
 * @param [props.secureTextEntry] if true hide input
 * @example
 * <Input
 *   onChange={setAddress}
 *   value={address}
 *   label={i18n('form.btcAddress')}
 *   isValid={!isFieldInError('address')}
 *   autoCorrect={false}
 *   errorMessage={getErrorsInField('address')}
 * />
 */
export const Input = ({
  value,
  label,
  icon,
  autoCorrect = false,
  isValid,
  errorMessage = [],
  onChange,
  onSubmit,
  secureTextEntry
}: InputProps): ReactElement => <View>
  <View style={tw`overflow-hidden rounded`}>
    <Shadow {...innerShadow} viewStyle={[
      tw`w-full flex flex-row items-center h-10 border border-grey-4 rounded pl-7 pr-3`,
      isValid && value ? tw`border-green` : {},
      errorMessage.length > 0 ? tw`border-red` : {}
    ]}>
      <TextInput
        style={[tw`w-full flex-shrink  h-10 p-0 text-grey-1 text-lg leading-5`]}
        placeholder={label}
        value={value}
        autoCorrect={autoCorrect}
        onChangeText={(val: string) => onChange ? onChange(val) : null}
        onSubmitEditing={(e) => onSubmit ? onSubmit(e.nativeEvent.text?.trim()) : null}
        onEndEditing={(e) => onChange ? onChange(e.nativeEvent.text?.trim()) : null}
        secureTextEntry={secureTextEntry}
      />
      {icon
        ? <Pressable onPress={() => onSubmit ? onSubmit(value) : null}>
          <Icon id="send" style={tw`w-5 h-5`} />
        </Pressable>
        : null
      }
    </Shadow>
  </View>

  {errorMessage.length > 0
    ? <Text style={tw`font-baloo text-xs text-red text-center mt-2`}>{errorMessage[0]}</Text>
    : null
  }
</View>

export default Input