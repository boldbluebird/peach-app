import { View } from 'react-native'
import { BitcoinAddress, Divider, Icon, Loading, PeachScrollView, PrimaryButton, Text } from '../../components'
import { TradeInfo } from '../../components/offer'
import { BTCAmount } from '../../components/bitcoin'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { offerIdToHex } from '../../utils/offer'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { NoEscrowFound } from './components/NoEscrowFound'
import { TransactionInMempool } from './components/TransactionInMempool'
import { useFundEscrowSetup } from './hooks/useFundEscrowSetup'
import { useFundFromPeachWallet } from './hooks/useFundFromPeachWallet'

export const FundEscrow = () => {
  const { offerId, offer, isLoading, escrow, createEscrowError, fundingStatus, fundingAmount } = useFundEscrowSetup()
  const { fundFromPeachWallet, fundedFromPeachWallet } = useFundFromPeachWallet({ offer, fundingStatus })

  if (createEscrowError) return <NoEscrowFound />
  if (isLoading || !escrow) return <BitcoinLoading text={i18n('sell.escrow.loading')} />

  if (fundingStatus.status === 'MEMPOOL') return <TransactionInMempool txId={fundingStatus.txIds[0]} />

  return (
    <View style={tw`h-full`}>
      <PeachScrollView style={tw`flex-shrink h-full`} contentContainerStyle={tw`justify-center px-7`}>
        <View style={tw`flex-shrink h-full gap-4`}>
          <View style={tw`flex-row items-center justify-center`}>
            <Text style={tw`settings`}>{i18n('sell.escrow.sendSats.1')} </Text>
            <BTCAmount style={tw`-mt-0.5`} amount={fundingAmount} size="medium" />
            <Text style={tw`settings`}> {i18n('sell.escrow.sendSats.2')}</Text>
          </View>
          <BitcoinAddress
            address={escrow}
            amount={fundingAmount / SATSINBTC}
            label={`${i18n('settings.escrow.paymentRequest.label')} ${offerIdToHex(offerId)}`}
          />
        </View>
      </PeachScrollView>
      <View style={tw`flex items-center justify-center w-full gap-4 p-4 px-7`}>
        <View style={tw`flex-row items-center justify-center gap-2`}>
          <Text style={tw`text-primary-main button-medium`}>{i18n('sell.escrow.checkingFundingStatus')}</Text>
          <Loading style={tw`w-4 h-4`} color={tw`text-primary-main`.color} />
        </View>
        <Divider />
        {fundedFromPeachWallet ? (
          <TradeInfo
            text={i18n('fundFromPeachWallet.funded')}
            IconComponent={<Icon id="checkCircle" style={tw`w-4 h-4`} color={tw`text-success-main`.color} />}
          />
        ) : (
          <PrimaryButton testID="escrow-fund" border iconId="sell" onPress={fundFromPeachWallet}>
            {i18n('fundFromPeachWallet.button')}
          </PrimaryButton>
        )}
      </View>
    </View>
  )
}
