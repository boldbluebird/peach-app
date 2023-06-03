import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../hooks'
import { HelpType, helpOverlays } from '../overlays/helpOverlays'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'

export const useShowHelp = (id: HelpType) => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const goToHelp = useCallback(() => {
    closePopup()
    navigation.navigate('contact')
  }, [navigation, closePopup])

  const showHelp = useCallback(() => {
    const Content = helpOverlays[id].content

    setPopup({
      title: helpOverlays[id].title,
      content: <Content />,
      visible: true,
      action2: {
        callback: goToHelp,
        label: i18n('help'),
        icon: 'info',
      },
      level: 'INFO',
    })
  }, [closePopup, id, navigation, setPopup])

  return showHelp
}
