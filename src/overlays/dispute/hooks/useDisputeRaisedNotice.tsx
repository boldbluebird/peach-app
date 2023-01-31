import React, { useCallback, useContext, useState } from 'react'
import { Keyboard } from 'react-native'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation, useValidatedState } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { account } from '../../../utils/account'
import { getChat, saveChat } from '../../../utils/chat'
import { initDisputeSystemMessages } from '../../../utils/chat/createDisputeSystemMessages'
import i18n from '../../../utils/i18n'
import { getContract as getContractAPI } from '../../../utils/peachAPI'
import { acknowledgeDispute } from '../../../utils/peachAPI/private/contract'
import { isEmailRequired } from '../../../views/dispute/DisputeForm'
import DisputeRaisedNotice from '../components/DisputeRaisedNotice'

const emailRules = { required: true, email: true }

export const useDisputeRaisedNotice = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const [, setLoading] = useState(false)
  const [email, setEmail, isEmailValid, emailErrors] = useValidatedState<string>('', emailRules)

  const showError = useShowErrorBanner()

  const closeOverlay = useCallback(() => {
    updateOverlay({ visible: false })
  }, [updateOverlay])

  const goToChat = useCallback(
    (contractId: string) => {
      navigation.navigate('contractChat', { contractId })
    },
    [navigation],
  )

  const submit = useCallback(
    async (contract: Contract, reason: DisputeReason) => {
      const isFormValid = isEmailValid
      if (!isFormValid && isEmailRequired(reason)) return

      setLoading(true)
      const [acknowledgeDisputeResult, getContractResult] = await Promise.all([
        acknowledgeDispute({
          contractId: contract.id,
          email,
        }),
        getContractAPI({ contractId: contract.id }),
      ])
      const [result, err] = acknowledgeDisputeResult
      if (result) {
        setLoading(false)
        const updatedContract = getContractResult[0] || {
          ...contract,
          disputeDate: new Date(),
          disputeInitiator: contract?.seller.id === account.publicKey ? contract.buyer.id : contract?.seller.id,
        }
        const chat = getChat(contract.id)
        const autogeneratedMessages = initDisputeSystemMessages(chat.id, updatedContract as Contract)
        saveChat(contract.id, {
          messages: autogeneratedMessages,
        })
        if (isEmailRequired(reason)) {
          Keyboard.dismiss()
        }
        closeOverlay()
        return
      }

      if (err) showError(err?.error)
      setLoading(false)
    },
    [closeOverlay, email, isEmailValid, showError],
  )

  return useCallback(
    (contract: Contract, view: ContractViewer) =>
      updateOverlay({
        title: i18n('dispute.opened'),
        level: 'WARN',
        content: (
          <DisputeRaisedNotice
            submit={submit}
            contract={contract}
            view={view}
            email={email}
            setEmail={setEmail}
            emailErrors={emailErrors}
            disputeReason={contract.disputeReason ?? 'other'}
          />
        ),
        visible: true,
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            submit(contract, contract.disputeReason ?? 'other')
          },
        },
        action1: isEmailRequired(contract.disputeReason ?? 'other')
          ? {
            label: i18n('send'),
            icon: 'arrowRightCircle',
            callback: () => {
              submit(contract, contract.disputeReason ?? 'other')
              goToChat(contract.id)
            },
          }
          : {
            label: i18n('goToChat'),
            icon: 'messageCircle',
            callback: () => {
              submit(contract, contract.disputeReason ?? 'other')
              goToChat(contract.id)
            },
          },
      }),
    [email, emailErrors, goToChat, setEmail, submit, updateOverlay],
  )
}
