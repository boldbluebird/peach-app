import React, { ReactElement } from 'react'
import { ColorValue, View, ViewStyle } from 'react-native'
import { Icon, Text } from '../../../components'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { toTimeFormat } from '../../../utils/date/toShortDateFormat'
import { toDateFormat } from '../../../utils/date'
import LinedText from '../../../components/ui/LinedText'

type GetMessageMetaProps = {
  message: Message
  previous: Message
  tradingPartner: string
  online: boolean
}
type MessageMeta = {
  online: boolean
  showName: boolean
  name: string
  isYou: boolean
  isTradingPartner: boolean
  isMediator: boolean
  isSystemMessage: boolean
  readByCounterParty: boolean
}

const getMessageMeta = ({ message, previous, tradingPartner, online }: GetMessageMetaProps): MessageMeta => {
  const isYou = message.from === account.publicKey
  const isTradingPartner = message.from === tradingPartner
  const isMediator = !isYou && !isTradingPartner
  const isSystemMessage = message.from === 'system'
  const readByCounterParty = message.readBy?.includes(tradingPartner)
  const showName = !previous || previous.from !== message.from
  const name = i18n(
    isSystemMessage ? 'chat.systemMessage' : isMediator ? 'chat.mediator' : isYou ? 'chat.you' : 'chat.tradePartner',
  )
  return {
    online,
    showName,
    name,
    isYou,
    isTradingPartner,
    isMediator,
    isSystemMessage,
    readByCounterParty,
  }
}

type MessageStyling = {
  text: ViewStyle
  bgColor: ViewStyle
  statusIcon: IconType
  statusIconColor: ColorValue
}
const getMessageStyling = (message: Message, meta: MessageMeta): MessageStyling => {
  const text = meta.isMediator || meta.isSystemMessage ? tw`text-primary-main` : tw`text-black-2`
  const bgColor = !message.message
    ? tw`bg-error-background` // TODO : Which color for error
    : meta.isMediator || meta.isSystemMessage
      ? tw`bg-primary-mild-1`
      : meta.isYou
        ? tw`bg-info-background`
        : tw`bg-black-6`
  const statusIcon
    = message.readBy?.length === 0
      ? !meta.online
        ? 'offline'
        : 'clock'
      : meta.readByCounterParty
        ? 'chatDoubleCheck'
        : 'check'
  const statusIconColor = statusIcon === 'chatDoubleCheck' ? tw`text-blue-1`.color : tw`text-grey-3`.color
  return {
    text,
    bgColor,
    statusIcon,
    statusIconColor: statusIconColor!,
  }
}
type ChatMessageProps = {
  chatMessages: Message[]
  tradingPartner: string
  item: Message
  index: number
  online: boolean
}

export const ChatMessage = ({ chatMessages, tradingPartner, item, index, online }: ChatMessageProps): ReactElement => {
  const message = item
  const meta = getMessageMeta({
    message,
    previous: chatMessages[index - 1],
    tradingPartner,
    online,
  })
  const { statusIcon, statusIconColor, text, bgColor } = getMessageStyling(message, meta)

  const isChangeDate = index === 0 || toDateFormat(message.date) !== toDateFormat(chatMessages[index - 1].date)

  return (
    <>
      {isChangeDate && (
        <LinedText style={tw`px-6 py-2`}>
          <Text style={tw`body-m text-black-2`}>{toDateFormat(message.date)}</Text>
        </LinedText>
      )}
      <View
        onStartShouldSetResponder={() => true}
        style={[tw`w-10/12 px-3 bg-transparent`, meta.isYou ? tw`self-end` : {}]}
      >
        {meta.showName && !meta.isYou ? <Text style={[tw`px-1 mt-4 subtitle-1`, text]}>{meta.name}</Text> : null}
        <View style={[tw`px-3 py-2 mt-2 rounded-lg`, bgColor]}>
          <Text style={tw`flex-shrink-0`}>{message.message || i18n('chat.decyptionFailed')}</Text>
          <Text style={tw`pt-1 ml-auto leading-5 text-right `}>
            <Text style={tw`body-s text-black-3`}>{toTimeFormat(message.date)}</Text>
            {meta.isYou && (
              <View style={tw`pl-1`}>
                <Icon id={statusIcon} style={tw`relative w-4 h-4 -bottom-1`} color={statusIconColor} />
              </View>
            )}
          </Text>
        </View>
      </View>
    </>
  )
}
