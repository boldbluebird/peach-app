import { PaymentStatus } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import { useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/animation/Loading";
import { LightningInvoice } from "../../components/bitcoin/LightningInvoice";
import { Button } from "../../components/buttons/Button";
import { TradeInfo } from "../../components/offer/TradeInfo";
import { ErrorBox } from "../../components/ui/ErrorBox";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import tw from "../../styles/tailwind";
import { usePostReverseSubmarineSwap } from "../../utils/boltz/query/usePostReverseSubmarineSwap";
import { useSwapStatus } from "../../utils/boltz/query/useSwapStatus";
import i18n from "../../utils/i18n";
import { useWalletState } from "../../utils/wallet/walletStore";
import { useLightningWalletBalance } from "../wallet/hooks/useLightningWalletBalance";
import { usePayInvoice } from "../wallet/hooks/usePayInvoice";
import { ClaimReverseSubmarineSwap } from "./components/ClaimReverseSubmarineSwap";

export type Props = {
  offerId: string;
  address: string;
  amount: number;
};

export const ReverseSubmarineSwap = ({ offerId, address, amount }: Props) => {
  const { data, error } = usePostReverseSubmarineSwap({ address, amount });
  const swapInfo = data?.swapInfo;
  const { status } = useSwapStatus({ id: swapInfo?.id });
  const [saveSwap, mapSwap] = useBoltzSwapStore(
    (state) => [state.saveSwap, state.mapSwap],
    shallow,
  );

  useEffect(() => {
    if (data?.swapInfo) {
      saveSwap({
        ...data.swapInfo,
        keyPairIndex: data.keyPairIndex,
        preimage: data.preimage,
      });
      mapSwap(offerId, data?.swapInfo.id);
    }
  }, [
    data?.keyPairIndex,
    data?.preimage,
    data?.swapInfo,
    mapSwap,
    offerId,
    saveSwap,
  ]);

  if (error?.message) return <ErrorBox>{error.message}</ErrorBox>;
  if (!swapInfo?.invoice) return <Loading />;

  if (!!data && status?.status === "transaction.mempool")
    return (
      <ClaimReverseSubmarineSwap
        offerId={offerId}
        address={address}
        swapInfo={swapInfo}
        swapStatus={status}
        keyPairWIF={data.keyPairWIF}
        preimage={data.preimage}
      />
    );

  return (
    <>
      <LightningInvoice invoice={swapInfo.invoice} />
      <FundFromPeachLightningWalletButton
        invoice={swapInfo.invoice}
        address={address}
        amount={amount}
      />
    </>
  );
};

type FundFromPeachLightningWalletButtonProps = {
  invoice: string;
  address: string;
  amount: number;
};
function FundFromPeachLightningWalletButton({
  invoice,
  address,
  amount,
}: FundFromPeachLightningWalletButtonProps) {
  const [fundedFromPeachWallet, setFundedFromPeachWallet] = useWalletState(
    (state) => [
      state.isFundedFromPeachWallet(address),
      state.setFundedFromPeachWallet,
    ],
    shallow,
  );
  const paymentRequest = useMemo(() => bolt11.decode(invoice), [invoice]);
  const { balance } = useLightningWalletBalance();
  const { payInvoice, isPayingInvoice } = usePayInvoice({
    paymentRequest,
    amount,
  });
  const onButtonPress = () => {
    payInvoice().then((data) => {
      if (data.status !== PaymentStatus.FAILED)
        setFundedFromPeachWallet(address);
    });
  };

  return (
    <>
      {fundedFromPeachWallet ? (
        <TradeInfo
          text={i18n("fundFromPeachWallet.funded")}
          IconComponent={
            <Icon id="checkCircle" size={16} color={tw.color("success-main")} />
          }
        />
      ) : (
        <Button
          ghost
          textColor={tw.color("primary-main")}
          iconId="sell"
          onPress={onButtonPress}
          disabled={balance.lightning <= amount}
          loading={isPayingInvoice}
        >
          {i18n("fundFromPeachWallet.button")}
        </Button>
      )}
    </>
  );
}
