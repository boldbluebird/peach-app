import analytics from "@react-native-firebase/analytics";
import { useConfigStore } from "../../store/configStore/configStore";
import { offerPreferencesStorage } from "../../store/offerPreferenes/useOfferPreferences";
import { settingsStorage } from "../../store/settingsStore/settingsStorage";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import {
  notificationStorage,
  useNotificationStore,
} from "../../views/home/notificationsStore";
import { info } from "../log/info";
import { peachAPI } from "../peachAPI";
import { setPeachWallet } from "../wallet/setWallet";
import { useWalletState, walletStorage } from "../wallet/walletStore";
import { defaultAccount } from "./account";
import { accountStorage } from "./accountStorage";
import { chatStorage } from "./chatStorage";
import { updateAccount } from "./updateAccount";

export const deleteAccount = () => {
  info("Deleting account");

  updateAccount(defaultAccount, true);
  [
    accountStorage,
    walletStorage,
    offerPreferencesStorage,
    chatStorage,
    settingsStorage,
    notificationStorage,
  ].forEach((storage) => storage.clearStore());
  [
    // useAccountStore,
    useNotificationStore,
    useConfigStore,
    useWalletState,
    useSettingsStore,
    usePaymentDataStore,
  ].forEach((store) => store.getState().reset());

  setPeachWallet(undefined)
  peachAPI.setPeachAccount(null);
  analytics().logEvent("account_deleted");
};
