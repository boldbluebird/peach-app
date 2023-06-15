import { SettingsStore } from '../settingsStore'

export const getPureSettingsState = (state: SettingsStore): Settings => ({
  appVersion: state.appVersion,
  analyticsPopupSeen: state.analyticsPopupSeen,
  enableAnalytics: state.enableAnalytics,
  locale: state.locale,
  returnAddress: state.returnAddress,
  payoutAddress: state.payoutAddress,
  payoutAddressLabel: state.payoutAddressLabel,
  payoutAddressSignature: state.payoutAddressSignature,
  derivationPath: state.derivationPath,
  displayCurrency: state.displayCurrency,
  country: state.country,
  pgpPublished: state.pgpPublished,
  fcmToken: state.fcmToken,
  lastFileBackupDate: state.lastFileBackupDate,
  lastSeedBackupDate: state.lastSeedBackupDate,
  showBackupReminder: state.showBackupReminder,
  shouldShowBackupOverlay: state.shouldShowBackupOverlay,
  peachWalletActive: state.peachWalletActive,
  nodeURL: state.nodeURL,
  feeRate: state.feeRate,
  usedReferralCode: state.usedReferralCode,
  lastBackupDate: state.lastBackupDate,
})
