import ecc from "@bitcoinerlab/secp256k1";
import { API_URL } from "@env";
import CookieManager from "@react-native-cookies/cookies";
import { initEccLib } from "bitcoinjs-lib";
import { useCallback } from "react";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { defaultAccount, useAccountStore } from "../utils/account/account";
import { accountStorage } from "../utils/account/accountStorage";
import { chatStorage } from "../utils/account/chatStorage";
import { updateAccount } from "../utils/account/updateAccount";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { getIndexedMap } from "../utils/storage/getIndexedMap";
import {
  dataMigrationAfterLoadingAccount,
  dataMigrationBeforeLoadingAccount,
} from "./dataMigration";
import { getPeachInfo } from "./getPeachInfo";
import { useUserUpdate } from "./useUserUpdate";

initEccLib(ecc);

export function useInitApp() {
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn);
  const userUpdate = useUserUpdate();

  const initApp = useCallback(async () => {
    dataMigrationBeforeLoadingAccount();

    await setCookies();
    const { publicKey } = await loadAccount();

    const statusResponse = await getPeachInfo();
    if (!statusResponse?.error && publicKey) {
      setIsLoggedIn(true);
      userUpdate();
      dataMigrationAfterLoadingAccount();
    }

    return statusResponse;
  }, [setIsLoggedIn, userUpdate]);

  return initApp;
}

async function setCookies() {
  const cfClearance =
    useSettingsStore.getState().cloudflareChallenge?.cfClearance;
  if (cfClearance)
    await CookieManager.set(API_URL, {
      name: "cf_clearance",
      value: cfClearance,
      secure: true,
      httpOnly: true,
      domain: ".peachbitcoin.com",
    });
}

async function loadAccount() {
  const account = useAccountStore.getState().account;
  if (account.publicKey) return account;

  info("Loading full account from secure storage");
  const identity = loadIdentity();

  if (!identity?.publicKey) {
    error("Account does not exist");
    return defaultAccount;
  }

  const [tradingLimit, chats] = await Promise.all([
    loadTradingLimit(),
    loadChats(),
  ]);

  const acc = {
    ...identity,
    tradingLimit,
    chats,
  };

  info("Account loaded", account.publicKey);
  updateAccount(acc);

  return useAccountStore.getState().account;
}

async function loadChats() {
  return (await getIndexedMap(chatStorage)) as Account["chats"];
}

const emptyIdentity: Identity = {
  publicKey: "",
  privKey: "",
  mnemonic: "",
  pgp: {
    publicKey: "",
    privateKey: "",
  },
};

function loadIdentity() {
  const identity = accountStorage.getMap("identity");

  if (identity) return identity as Identity;

  error("Could not load identity");
  return emptyIdentity;
}

function loadTradingLimit() {
  const tradingLimit = accountStorage.getMap("tradingLimit");

  if (tradingLimit) return tradingLimit as Account["tradingLimit"];

  error("Could not load tradingLimit");
  return defaultAccount.tradingLimit;
}
