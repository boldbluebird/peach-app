import { NETWORK } from '@env'
import { useCallback } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { PrimaryButton } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { useNavigation, useShowHelp } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useConfigStore } from '../../store/configStore'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { getNavigationDestinationForContract, getOfferIdFromContract, getRequiredAction } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getContract, getOfferDetails } from '../../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../yourTrades/utils'
import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { ContractCTA } from './components/ContractCTA'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { ProvideEmailButton } from './components/ProvideEmailButton'
import { useContractContext } from './context'

export const ContractActions = () => {
  const { contract, view } = useContractContext()
  const requiredAction = getRequiredAction(contract)
  const { isEmailRequired, tradeStatus, disputeWinner, batchInfo, releaseTxId } = contract
  const shouldShowReleaseEscrow = tradeStatus === 'releaseEscrow' && !!disputeWinner
  return (
    <View style={tw`items-center justify-end w-full gap-3`}>
      <View style={tw`flex-row items-center justify-center gap-6`}>
        <EscrowButton />
        <ChatButton />
      </View>
      {shouldShowPayoutPending(view, batchInfo, releaseTxId) && <PayoutPendingButton />}
      <ContractStatusInfo requiredAction={requiredAction} />
      {!!isEmailRequired && <ProvideEmailButton style={tw`self-center`} />}
      <NewOfferButton />
      {!shouldShowReleaseEscrow && <ContractCTA requiredAction={requiredAction} />}
      {tradeStatus === 'refundOrReviveRequired' && !!disputeWinner && <ResolveDisputeSliders />}
      {shouldShowReleaseEscrow && <ReleaseEscrowSlider {...{ contract }} />}
    </View>
  )
}

function NewOfferButton () {
  const navigation = useNavigation()
  const { contract } = useContractContext()
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const newOfferId = offer?.newOfferId
  const goToNewOffer = useCallback(async () => {
    if (!newOfferId) return
    const [newOffer] = await getOfferDetails({ offerId: newOfferId })
    if (!newOffer) return
    if (newOffer?.contractId) {
      const [newContract] = await getContract({ contractId: newOffer.contractId })
      if (newContract === null) return
      const [screen, params] = await getNavigationDestinationForContract(newContract)
      navigation.replace(screen, params)
    } else {
      navigation.replace(...getNavigationDestinationForOffer(newOffer))
    }
  }, [newOfferId, navigation])

  return <>{!!newOfferId && <PrimaryButton onPress={goToNewOffer}>{i18n('contract.goToNewTrade')}</PrimaryButton>}</>
}

function shouldShowPayoutPending (view: string, batchInfo: BatchInfo | undefined, releaseTxId: string | undefined) {
  return view === 'buyer' && !!batchInfo && !batchInfo.completed && !releaseTxId
}

function PayoutPendingButton () {
  const { contract, showBatchInfo, toggleShowBatchInfo } = useContractContext()
  const { disputeActive } = contract

  return (
    <Button style={[tw`self-center`, disputeActive && tw`bg-error-main`]} iconId="eye" onPress={toggleShowBatchInfo}>
      {i18n(showBatchInfo ? 'contract.summary.tradeDetails' : 'offer.requiredAction.payoutPending')}
    </Button>
  )
}

function EscrowButton () {
  const { releaseTxId, escrow, disputeActive } = useContractContext().contract
  const openEscrow = () => (releaseTxId ? showTransaction(releaseTxId, NETWORK) : showAddress(escrow, NETWORK))

  return (
    <Button
      iconId="externalLink"
      style={tw`flex-1 bg-transparent`}
      textColor={disputeActive ? tw`text-error-light` : tw`text-primary-main`}
      ghost
      onPress={openEscrow}
    >
      {i18n('escrow')}
    </Button>
  )
}

function ChatButton () {
  const {
    contract: { messages, id, disputeActive },
  } = useContractContext()
  const navigation = useNavigation()
  const showHelp = useShowHelp('disputeDisclaimer')
  const [seenDisputeDisclaimer, setSeenDisputeDisclaimer] = useConfigStore(
    (state) => [state.seenDisputeDisclaimer, state.setSeenDisputeDisclaimer],
    shallow,
  )
  const goToChat = () => {
    navigation.push('contractChat', { contractId: id })
    if (!seenDisputeDisclaimer) {
      showHelp()
      setSeenDisputeDisclaimer(true)
    }
  }
  return (
    <Button
      style={[tw`flex-1`, disputeActive && tw`bg-error-main`]}
      iconId={messages === 0 ? 'messageCircle' : 'messageFull'}
      onPress={goToChat}
    >
      {messages === 0 ? i18n('chat') : `${messages} ${i18n('contract.unread')}`}
    </Button>
  )
}
