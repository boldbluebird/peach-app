import { useState } from 'react'
import { GestureResponderEvent, View } from 'react-native'
import { HorizontalLine } from '../..'
import tw from '../../../styles/tailwind'
import { useDrawerState } from '../useDrawerState'
import { CloseIcon } from './CloseIcon'
import { DrawerTitle } from './DrawerTitle'
import { GoBackIcon } from './GoBackIcon'

type Props = {
  closeDrawer: () => void
}

export const DrawerHeader = ({ closeDrawer }: Props) => {
  const options = useDrawerState((state) => state.options)
  const [touchY, setTouchY] = useState<number>()
  const registerTouchStart = (e: GestureResponderEvent) => setTouchY(e.nativeEvent.pageY)
  const registerTouchMove = (e: GestureResponderEvent) => {
    if (touchY === undefined) return
    if (touchY - e.nativeEvent.pageY < -20) {
      closeDrawer()
      setTouchY(undefined)
    }
  }
  return (
    <View style={tw`gap-6`}>
      <View
        style={tw`flex-row items-center justify-between px-3`}
        testID="touchResponder"
        onTouchStart={registerTouchStart}
        onTouchMove={registerTouchMove}
      >
        <GoBackIcon />
        <DrawerTitle />
        <CloseIcon closeDrawer={closeDrawer} />
      </View>
      <HorizontalLine style={options[0]?.highlighted && tw`bg-primary-mild-1`} />
    </View>
  )
}
