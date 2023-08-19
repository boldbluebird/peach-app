import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { View } from 'react-native'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { NewHeader as Header, Screen, Text } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import tw from '../../styles/tailwind'
import { writeFile } from '../../utils/file'
import i18n from '../../utils/i18n'
import { useWalletState } from '../../utils/wallet/walletStore'
import { getTxSummary } from './helpers/getTxSummary'

export const ExportTransactionHistory = () => {
  const transactions = useWalletState((state) => state.transactions)
  const handleError = useShowErrorBanner()

  const onPress = async () => {
    const destinationFileName = 'transaction-history.csv'
    await writeTransactionCSV(transactions, destinationFileName)

    Share.open({
      title: destinationFileName,
      url: `file://${RNFS.DocumentDirectoryPath}/${destinationFileName}`,
    }).catch(handleError)
  }

  return (
    <Screen>
      <Header title={i18n('wallet.exportHistory.title')} />
      <View style={tw`justify-center gap-8 grow`}>
        <Text style={tw`body-l`}>
          {`${i18n('wallet.exportHistory.description')}
  • ${i18n('wallet.exportHistory.description.point1')}
  • ${i18n('wallet.exportHistory.description.point2')}
  • ${i18n('wallet.exportHistory.description.point3')}
  • ${i18n('wallet.exportHistory.description.point4')}`}
        </Text>
      </View>
      <Button style={tw`self-center`} onPress={onPress}>
        {i18n('wallet.exportHistory.export')}
      </Button>
    </Screen>
  )
}

function writeTransactionCSV (transactions: TransactionDetails[], destinationFileName: string) {
  let csvValue = 'Date, Type, Amount, Transaction ID\n'

  transactions.forEach((transaction) => {
    const { amount, type, id: transactionId, date } = getTxSummary(transaction)
    const dateString = date.toLocaleString().replaceAll(',', '')

    csvValue += `${dateString}, ${type}, ${amount}, ${transactionId}\n`
  })

  return writeFile(`/${destinationFileName}`, csvValue)
}
