import { PaymentStatus } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/Loading";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { LightningInvoice } from "../../components/bitcoin/LightningInvoice";
import { Button } from "../../components/buttons/Button";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { TradeInfo } from "../../components/offer/TradeInfo";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../components/text/PeachText";
import { ErrorBox } from "../../components/ui/ErrorBox";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useLiquidFeeRate } from "../../hooks/useLiquidFeeRate";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import tw from "../../styles/tailwind";
import { usePostReverseSubmarineSwap } from "../../utils/boltz/query/usePostReverseSubmarineSwap";
import { useReverseSubmarineSwaps } from "../../utils/boltz/query/useReverseSubmarineSwaps";
import { useSwapStatus } from "../../utils/boltz/query/useSwapStatus";
import i18n from "../../utils/i18n";
import { error } from "../../utils/log/error";
import { getTradingAmountLimits } from "../../utils/market/getTradingAmountLimits";
import { round } from "../../utils/math/round";
import { parseError } from "../../utils/parseError";
import { thousands } from "../../utils/string/thousands";
import { useWalletState } from "../../utils/wallet/walletStore";
import {
  MSAT_PER_SAT,
  useLightningWalletBalance,
} from "../wallet/hooks/useLightningWalletBalance";
import { usePayInvoice } from "../wallet/hooks/usePayInvoice";
import { ClaimReverseSubmarineSwap } from "./components/ClaimReverseSubmarineSwap";

const CLAIM_TX_SIZE_VB = 1380;
const BOLTZ_FEES_FALLBACK = 0.25;
const LN_FEE_RESERVE = 0.01;

const useAmountWithTxFees = ({ amount }: { amount: number }) => {
  const feeRate = useLiquidFeeRate();
  const minerFees = CLAIM_TX_SIZE_VB * feeRate;
  const amountWithTxFees = minerFees
    ? minerFees / SATSINBTC + amount
    : undefined;
  return { feeRate, amountWithTxFees };
};

export type Props = {
  offerId: string;
  address: string;
  amount: number;
  instantFund?: boolean;
};

export const ReverseSubmarineSwap = ({
  offerId,
  address,
  amount,
  instantFund,
}: Props) => {
  const [requestAmount, setRequestAmount] = useState(amount);
  const { feeRate, amountWithTxFees } = useAmountWithTxFees({
    amount: requestAmount,
  });
  const { data, error: postReverseSubmarineError } =
    usePostReverseSubmarineSwap({
      address,
      amount: amountWithTxFees,
    });
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

  if (postReverseSubmarineError?.message)
    return <ErrorBox>{postReverseSubmarineError.message}</ErrorBox>;
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
        onchainAmount={requestAmount}
        instantFund={instantFund}
        feeRate={feeRate}
        setRequestAmount={setRequestAmount}
      />
    </>
  );
};

type FundFromPeachLightningWalletButtonProps = {
  invoice: string;
  address: string;
  onchainAmount: number;
  instantFund?: boolean;
  feeRate: number;
  setRequestAmount: Dispatch<SetStateAction<number>>;
};
function FundFromPeachLightningWalletButton({
  invoice,
  address,
  onchainAmount,
  instantFund,
  feeRate,
  setRequestAmount,
}: FundFromPeachLightningWalletButtonProps) {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { data: marketPrices } = useMarketPrices();
  const [minTradingAmount] = getTradingAmountLimits(
    marketPrices?.CHF || 0,
    "sell",
  );
  const { reverseSubmarineList } = useReverseSubmarineSwaps();
  const pair = reverseSubmarineList?.BTC?.["L-BTC"];
  const feePercentage = pair?.fees?.percentage || BOLTZ_FEES_FALLBACK;

  const showErrorBanner = useShowErrorBanner();
  const [fundedFromPeachWallet, setFundedFromPeachWallet] = useWalletState(
    (state) => [
      state.isFundedFromPeachWallet(address),
      state.setFundedFromPeachWallet,
    ],
    shallow,
  );
  const [waitForNewAmount, setWaitForNewAmount] = useState(false);
  const paymentRequest = useMemo(() => bolt11.decode(invoice), [invoice]);
  const onchainAmountSats = onchainAmount * SATSINBTC;
  const amount = useMemo(() => {
    if (!paymentRequest.millisatoshis) return onchainAmountSats;
    return Number(paymentRequest.millisatoshis) / MSAT_PER_SAT;
  }, [onchainAmountSats, paymentRequest.millisatoshis]);
  const boltzFees = round((feePercentage / CENT) * onchainAmountSats);
  const minerFees = round(amount - onchainAmountSats - boltzFees);

  const { balance } = useLightningWalletBalance();

  const { payInvoice, isPayingInvoice } = usePayInvoice({
    paymentRequest,
    amount: amount * MSAT_PER_SAT,
  });

  const payLightningInvoice = useCallback(() => {
    if (isPayingInvoice) return;
    closePopup();
    payInvoice()
      .then((data) => {
        if (data.status !== PaymentStatus.FAILED)
          setFundedFromPeachWallet(address);
      })
      .catch((e) => {
        error(parseError(e));
        showErrorBanner("LIGHTNING_PAYMENT_FAILED");
      });
  }, [
    address,
    closePopup,
    isPayingInvoice,
    payInvoice,
    setFundedFromPeachWallet,
    showErrorBanner,
  ]);

  const onButtonPress = useCallback(() => {
    if (balance.lightning < amount) {
      const newAmountRequest =
        balance.lightning -
        (balance.lightning * feePercentage) / CENT -
        minerFees;
      setRequestAmount(
        (newAmountRequest - balance.lightning * LN_FEE_RESERVE) / SATSINBTC,
      );
      setWaitForNewAmount(true);
      return;
    }
    setPopup(
      <PopupComponent
        title={i18n("fundFromPeachWallet.confirm.title")}
        content={
          <>
            <View style={tw`gap-3`}>
              <PeachText>{i18n("wallet.sendBitcoin.youreSending")}</PeachText>
              <BTCAmount chain="lightning" amount={amount} size="medium" />
              <PeachText>
                {i18n(
                  "transaction.details.networkFee",
                  thousands(minerFees),
                  thousands(feeRate),
                )}
              </PeachText>
              <PeachText>
                {i18n("wallet.swap.swapFee", thousands(boltzFees))} (
                {feePercentage}%)
              </PeachText>
            </View>

            <ConfirmSlider
              label1={i18n("wallet.swap.confirm")}
              onConfirm={payLightningInvoice}
            />
          </>
        }
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    );
  }, [
    amount,
    balance.lightning,
    boltzFees,
    feePercentage,
    feeRate,
    minerFees,
    payLightningInvoice,
    setPopup,
    setRequestAmount,
  ]);

  useEffect(() => {
    if (instantFund) onButtonPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (waitForNewAmount) {
      setWaitForNewAmount(false);
      onButtonPress();
    }
  }, [waitForNewAmount, amount, onButtonPress]);

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
          disabled={balance.lightning <= minTradingAmount}
          loading={isPayingInvoice}
        >
          {i18n("fundFromPeachWallet.button")}
        </Button>
      )}
    </>
  );
}
