import React, { ReactElement } from 'react'
import {
  NativeSyntheticEvent,
  Pressable, TextInput,
  TextInputEndEditingEventData,
  TextInputSubmitEditingEventData,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

type MessageInputProps = ComponentProps & {
  value?: string,
  placeholder?: string,
  disabled?: boolean
  disableSubmit?: boolean
  onChange?: Function,
  onSubmit?: Function,
  onFocus?: Function,
  onBlur?: Function,
}

/**
 * @description Component to display an input field
 * @param props Component properties
 * @param [props.value] current value
 * @param [props.placeholder] text indicating action
 * @param [props.disabled] if true, disable input field
 * @param [props.disableSubmit] if true, disable submit field
 * @param [props.onChange] onchange handler from outside
 * @param [props.onSubmit] onsubmit handler from outside
 * @param [props.onFocus] onFocus handler from outside
 * @param [props.onBlur] onBlur handler from outside
 * @example
 * <MessageInput
 *   onChange={setNewMessage}
 *   onSubmit={sendMessage} disableSubmit={disableSend}
 *   value={newMessage}
 *   placeholder={i18n('chat.yourMessage')}
    />
 */

export const MessageInput = ({
  value,
  placeholder,
  disabled = false,
  disableSubmit = false,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  testID,
}: MessageInputProps): ReactElement => {
  const onChangeText = (val: string) => onChange ? onChange(val) : null
  const onSubmitEditing = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) =>
    onSubmit && !disableSubmit ? onSubmit(e.nativeEvent.text?.trim()) : null
  const onEndEditing = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) =>
    onChange ? onChange(e.nativeEvent.text?.trim()) : null
  const onFocusHandler = () => onFocus ? onFocus() : null
  const onBlurHandler = () => {
    if (onChange && value) onChange(value.trim())
    if (onBlur) onBlur()
  }
  // TODO Attach files
  return <View style={tw`rounded flex-row bg-chat-you-translucent items-center max-h-40`}>
    <Pressable onPress={() => onSubmit}>
      <Icon id={'clip'} style={tw`w-5 h-5 m-2 flex-1`}/>
    </Pressable>
    <TextInput testID={testID}
      style={tw`w-full h-10 flex-shrink font-lato leading-5 text-black-1`}
      placeholder={placeholder}
      placeholderTextColor={tw`text-black-1`.color as string}
      allowFontScaling={false}
      removeClippedSubviews={false}
      returnKeyType={'send'}
      value={value}
      editable={!disabled}
      multiline={true}
      textAlignVertical={'top'}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      onSubmitEditing={onSubmitEditing}
      blurOnSubmit={false}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      autoCapitalize="none"
    />
    <Pressable onPress={() => onSubmit && !disableSubmit ? onSubmit(value) : null}>
      <Icon id="send" style={tw`w-5 h-5 m-2 flex-1`} color={tw`text-blue-1`.color as string}/>
    </Pressable>
  </View>
}

export default MessageInput