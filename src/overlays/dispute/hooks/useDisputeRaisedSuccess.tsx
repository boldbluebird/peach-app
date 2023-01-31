import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import i18n from '../../../utils/i18n'
import DisputeRaisedSuccess from '../components/DisputeRaisedSuccess'

/**
 * @description Overlay appearing after raising dispute
 */
export const useDisputeRaisedSuccess = (view: ContractViewer) => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = useCallback(() => {
    updateOverlay({ visible: false })
  }, [updateOverlay])

  const showOverlay = useCallback(() => {
    updateOverlay({
      title: i18n('dispute.opened'),
      level: 'ERROR',
      content: <DisputeRaisedSuccess view={view} />,
      visible: true,
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closeOverlay,
      },
    })
  }, [updateOverlay, view, closeOverlay])
  return showOverlay
}
