import { BackgroundConfig } from '../components/background/Background'
import { MeetupScreen } from '../components/payment/MeetupScreen'
import { PaymentMethods } from '../components/payment/PaymentMethods'
import TestView from './TestView/TestView'
import TestViewButtons from './TestView/buttons'
import TestViewComponents from './TestView/components'
import TestViewMessages from './TestView/messages'
import TestViewPeachWallet from './TestView/peachWallet'
import TestViewPNs from './TestView/pns'
import TestViewPopups from './TestView/popups'
import AddPaymentMethod from './addPaymentMethod/AddPaymentMethod'
import { PaymentMethodDetails } from './addPaymentMethod/PaymentMethodDetails'
import BackupTime from './backupTime/BackupTime'
import Buy from './buy/Buy'
import { BuySummary } from './buy/BuySummary'
import SignMessage from './buy/SignMessage'
import Contact from './contact/Contact'
import Contract from './contract/Contract'
import PaymentMade from './contract/PaymentMade'
import ContractChat from './contractChat/ContractChat'
import DisputeForm from './dispute/DisputeForm'
import DisputeReasonSelector from './dispute/DisputeReasonSelector'
import FundEscrow from './fundEscrow/FundEscrow'
import { BitcoinLoading } from './loading/BitcoinLoading'
import NewUser from './newUser/NewUser'
import OfferDetails from './offerDetails/OfferDetails'
import NewBadge from './overlays/NewBadge'
import PublicProfile from './publicProfile/PublicProfile'
import Referrals from './referrals/Referrals'
import Report from './report/Report'
import RestoreBackup from './restoreBackup/RestoreBackup'
import RestoreReputation from './restoreReputation/RestoreReputation'
import OfferPublished from './search/OfferPublished'
import Search from './search/Search'
import SelectWallet from './selectWallet/SelectWallet'
import SetRefundWallet from './selectWallet/SetRefundWallet'
import { Premium } from './sell/Premium'
import Sell from './sell/Sell'
import { SellSummary } from './sell/SellSummary'
import Backups from './settings/Backups'
import Currency from './settings/Currency'
import Language from './settings/Language'
import NetworkFees from './settings/NetworkFees'
import PayoutAddress from './settings/PayoutAddress'
import Settings from './settings/Settings'
import AboutPeach from './settings/aboutPeach/AboutPeach'
import BitcoinProducts from './settings/aboutPeach/BitcoinProducts'
import PeachFees from './settings/aboutPeach/PeachFees'
import Socials from './settings/aboutPeach/Socials'
import BackupCreated from './settings/components/backups/BackupCreated'
import MyProfile from './settings/profile/MyProfile'
import TradeComplete from './tradeComplete/TradeComplete'
import { BumpNetworkFees } from './wallet/BumpNetworkFees'
import TransactionDetails from './wallet/TransactionDetails'
import TransactionHistory from './wallet/TransactionHistory'
import Wallet from './wallet/Wallet'
import Welcome from './welcome/Welcome'
import { WrongFundingAmount } from './wrongFundingAmount/WrongFundingAmount'
import YourTrades from './yourTrades/YourTrades'

type ViewType = {
  name: keyof RootStackParamList
  component: (props: any) => JSX.Element
  showHeader: boolean
  showFooter: boolean
  background: BackgroundConfig
  animationEnabled: boolean
}

const onboardingConfig = {
  showHeader: true,
  showFooter: false,
  background: { color: 'primaryGradient' },
  animationEnabled: false,
} as const
const defaultConfig = { showHeader: true, showFooter: true, background: { color: undefined }, animationEnabled: true }
const invertedThemeConfig = {
  showHeader: false,
  showFooter: false,
  background: { color: 'primaryGradient' },
  animationEnabled: false,
} as const

const onboarding: ViewType[] = [
  { name: 'welcome', component: Welcome, ...onboardingConfig },
  { name: 'home', component: Welcome, ...onboardingConfig },
  { name: 'newUser', component: NewUser, ...onboardingConfig },
  { name: 'restoreBackup', component: RestoreBackup, ...onboardingConfig },
  { name: 'restoreReputation', component: RestoreReputation, ...onboardingConfig },
]

const home: ViewType[] = [{ name: 'home', component: Buy, ...defaultConfig }]

const wallet: ViewType[] = [
  { name: 'wallet', component: Wallet, ...defaultConfig, animationEnabled: false },
  { name: 'transactionHistory', component: TransactionHistory, ...defaultConfig },
  { name: 'transactionDetails', component: TransactionDetails, ...defaultConfig },
  { name: 'bumpNetworkFees', component: BumpNetworkFees, ...defaultConfig },
]
const buyFlow: ViewType[] = [
  { name: 'buy', component: Buy, ...defaultConfig, animationEnabled: false },
  { name: 'buyPreferences', component: PaymentMethods, ...defaultConfig },
  { name: 'buySummary', component: BuySummary, ...defaultConfig },
  { name: 'signMessage', component: SignMessage, ...defaultConfig },
]

const sellFlow: ViewType[] = [
  { name: 'sell', component: Sell, ...defaultConfig, animationEnabled: false },
  { name: 'premium', component: Premium, ...defaultConfig },
  { name: 'sellPreferences', component: PaymentMethods, ...defaultConfig },
  { name: 'sellSummary', component: SellSummary, ...defaultConfig },
  { name: 'fundEscrow', component: FundEscrow, ...defaultConfig },
  { name: 'wrongFundingAmount', component: WrongFundingAmount, ...defaultConfig },
  { name: 'selectWallet', component: SelectWallet, ...defaultConfig },
  { name: 'setRefundWallet', component: SetRefundWallet, ...defaultConfig },
]

const search: ViewType[] = [{ name: 'search', component: Search, ...defaultConfig }]

const trade: ViewType[] = [
  { name: 'contract', component: Contract, ...defaultConfig },
  { name: 'contractChat', component: ContractChat, ...defaultConfig },
  { name: 'paymentMade', component: PaymentMade, ...invertedThemeConfig },
  { name: 'tradeComplete', component: TradeComplete, ...invertedThemeConfig },
]

const tradeHistory: ViewType[] = [
  { name: 'yourTrades', component: YourTrades, ...defaultConfig, animationEnabled: false },
  { name: 'offer', component: OfferDetails, ...defaultConfig },
]

const contact = (hasAccount: boolean): ViewType[] =>
  hasAccount
    ? [
      { name: 'contact', component: Contact, ...defaultConfig, showFooter: hasAccount },
      { name: 'report', component: Report, ...defaultConfig, showFooter: hasAccount },
      { name: 'disputeReasonSelector', component: DisputeReasonSelector, ...defaultConfig },
      { name: 'disputeForm', component: DisputeForm, ...defaultConfig },
    ]
    : [
      { name: 'contact', component: Contact, ...defaultConfig, showFooter: false },
      { name: 'report', component: Report, ...defaultConfig, showFooter: false },
    ]

const publicProfile: ViewType[] = [{ name: 'publicProfile', component: PublicProfile, ...defaultConfig }]

const overlays: ViewType[] = [
  { name: 'offerPublished', component: OfferPublished, ...invertedThemeConfig },
  { name: 'newBadge', component: NewBadge, ...invertedThemeConfig },
]

const settings: ViewType[] = [
  { name: 'settings', component: Settings, ...defaultConfig, animationEnabled: false },
  { name: 'aboutPeach', component: AboutPeach, ...defaultConfig },
  { name: 'myProfile', component: MyProfile, ...defaultConfig },
  { name: 'bitcoinProducts', component: BitcoinProducts, ...defaultConfig },
  { name: 'addPaymentMethod', component: AddPaymentMethod, ...defaultConfig },
  { name: 'paymentMethodDetails', component: PaymentMethodDetails, ...defaultConfig },
  { name: 'meetupScreen', component: MeetupScreen, ...defaultConfig },
  { name: 'currency', component: Currency, ...defaultConfig },
  { name: 'language', component: Language, ...defaultConfig },
  { name: 'referrals', component: Referrals, ...defaultConfig },
  { name: 'backupTime', component: BackupTime, ...invertedThemeConfig, showFooter: true },
  { name: 'backups', component: Backups, ...defaultConfig },
  { name: 'backupCreated', component: BackupCreated, ...invertedThemeConfig },
  { name: 'payoutAddress', component: PayoutAddress, ...defaultConfig },
  { name: 'paymentMethods', component: PaymentMethods, ...defaultConfig },
  { name: 'peachFees', component: PeachFees, ...defaultConfig },
  { name: 'networkFees', component: NetworkFees, ...defaultConfig },
  { name: 'socials', component: Socials, ...defaultConfig },
]

const testViews: ViewType[] = [
  { name: 'testView', component: TestView, ...defaultConfig },
  { name: 'testViewPeachWallet', component: TestViewPeachWallet, ...defaultConfig },
  { name: 'testViewButtons', component: TestViewButtons, ...defaultConfig },
  { name: 'testViewPopups', component: TestViewPopups, ...defaultConfig },
  { name: 'testViewMessages', component: TestViewMessages, ...defaultConfig },
  { name: 'testViewComponents', component: TestViewComponents, ...defaultConfig },
  { name: 'testViewPNs', component: TestViewPNs, ...defaultConfig },
  { name: 'testViewLoading', component: BitcoinLoading, ...defaultConfig },
]

export const getViews = (hasAccount: boolean): ViewType[] =>
  hasAccount
    ? [
      ...home,
      ...wallet,
      ...buyFlow,
      ...sellFlow,
      ...search,
      ...trade,
      ...tradeHistory,
      ...publicProfile,
      ...contact(hasAccount),
      ...settings,
      ...overlays,
      ...testViews,
    ]
    : [...onboarding, ...contact(hasAccount)]
