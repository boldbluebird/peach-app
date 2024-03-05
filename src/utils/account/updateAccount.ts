import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { tolgee, tolgeeStaticData } from "../../tolgee";
import i18n from "../i18n";
import { getDeviceLocale } from "../system/getDeviceLocale";
import { defaultAccount, useAccountStore } from "./account";
import { loadWalletFromAccount } from "./loadWalletFromAccount";
import { setWallets } from "./setWallets";
import { storeIdentity } from "./storeAccount/storeIdentity";

export const updateAccount = async (acc: Account, overwrite?: boolean) => {
  const newAccount = overwrite
    ? acc
    : {
        ...defaultAccount,
        ...acc,
        tradingLimit: defaultAccount.tradingLimit,
      };
  useAccountStore.setState({ account: newAccount });

  const newLocale =
    useSettingsStore.getState().locale || getDeviceLocale() || "en";
  i18n.setLocale(newLocale);
  await tolgee.changeLanguage(
    Object.keys(tolgeeStaticData).includes(newLocale) ? newLocale : "en",
  );
  const account = useAccountStore.getState().account;
  const { mnemonic } = account;
  if (mnemonic) {
    const wallet = loadWalletFromAccount({ ...account, mnemonic });
    await setWallets(wallet, mnemonic);
    if (!account.base58) {
      storeIdentity({
        ...account,
        base58: wallet.toBase58(),
      });
    }
  }
};
