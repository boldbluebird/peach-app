import { SettingsStore } from "../useSettingsStore";

export const getPureSettingsState = (state: SettingsStore): Settings => ({
  appVersion: state.appVersion,
  analyticsPopupSeen: state.analyticsPopupSeen,
  enableAnalytics: state.enableAnalytics,
  locale: state.locale,
  refundAddress: state.refundAddress,
  refundAddressLabel: state.refundAddressLabel,
  refundToPeachWallet: state.refundToPeachWallet,
  payoutAddress: state.payoutAddress,
  payoutAddressLabel: state.payoutAddressLabel,
  payoutAddressSignature: state.payoutAddressSignature,
  payoutToPeachWallet: state.payoutToPeachWallet,
  derivationPath: state.derivationPath,
  displayCurrency: state.displayCurrency,
  country: state.country,
  fcmToken: state.fcmToken,
  lastFileBackupDate: state.lastFileBackupDate,
  lastSeedBackupDate: state.lastSeedBackupDate,
  showBackupReminder: state.showBackupReminder,
  shouldShowBackupOverlay: state.shouldShowBackupOverlay,
  nodeURL: state.nodeURL,
  cloudflareChallenge: state.cloudflareChallenge,
  isLoggedIn: state.isLoggedIn,
});
