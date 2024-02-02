import { useQuery } from "@tanstack/react-query";
import { MSINAMINUTE } from "../../../constants";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { walletKeys } from "./useUTXOs";

export const useWalletAddress = (index: number) =>
  useQuery({
    queryKey: walletKeys.addressByIndex(index),
    queryFn: ({ queryKey: [, , addressIndex] }) =>
      peachWallet.getAddressByIndex(addressIndex),
    enabled: peachWallet.initialized && index >= 0,
    gcTime: MSINAMINUTE,
  });
