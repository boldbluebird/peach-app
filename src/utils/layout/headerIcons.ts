import { HeaderIcon } from '../../components/header/store'
import tw from '../../styles/tailwind'

export const headerIcons: Record<string, Omit<HeaderIcon, 'onPress'>> = {
  bitcoin: { id: 'bitcoin', color: tw`text-bitcoin`.color },
  cancel: { id: 'xCircle', color: tw`text-black-3`.color },
  checkbox: { id: 'checkboxMark', color: tw`text-black-2`.color },
  delete: { id: 'trash', color: tw`text-error-main`.color },
  edit: { id: 'edit3', color: tw`text-black-2`.color },
  help: { id: 'helpCircle', color: tw`text-info-light`.color },
  list: { id: 'yourTrades', color: tw`text-black-2`.color },
  wallet: { id: 'wallet', color: tw`text-black-2`.color },
  warning: { id: 'alertOctagon', color: tw`text-error-main`.color },
}
