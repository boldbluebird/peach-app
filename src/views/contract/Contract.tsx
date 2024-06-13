import { Screen } from "../../components/Screen";
import tw from "../../styles/tailwind";

import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo } from "react";
import { OverlayComponent } from "../../OverlayComponent";
import { Header, HeaderIcon } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { useHandleNotifications } from "../../hooks/notifications/useHandleNotifications";
import { useContractDetail } from "../../hooks/query/useContractDetail";
import { useRoute } from "../../hooks/useRoute";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { HelpPopup } from "../../popups/HelpPopup";
import { ConfirmTradeCancelationPopup } from "../../popups/tradeCancelation/ConfirmTradeCancelationPopup";
import { tolgee } from "../../tolgee";
import { useAccountStore } from "../../utils/account/account";
import { canCancelContract } from "../../utils/contract/canCancelContract";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getContractViewer } from "../../utils/contract/getContractViewer";
import { getRequiredAction } from "../../utils/contract/getRequiredAction";
import { isPaymentTooLate } from "../../utils/contract/status/isPaymentTooLate";
import { headerIcons } from "../../utils/layout/headerIcons";
import { useDecryptedContractData } from "../contractChat/useDecryptedContractData";
import { LoadingScreen } from "../loading/LoadingScreen";
import { TradeComplete } from "../tradeComplete/TradeComplete";
import { ContractActions } from "./ContractActions";
import { PendingPayoutInfo } from "./components/PendingPayoutInfo";
import { TradeInformation } from "./components/TradeInformation";
import { ContractContext, useContractContext } from "./context";

export const Contract = () => {
  const { contractId } = useRoute<"contract">().params;
  const { contract, isLoading, refetch } = useContractDetail(contractId);
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const view = contract
    ? getContractViewer(contract.seller.id, publicKey)
    : undefined;

  useHandleNotifications(
    useCallback(
      (message) => {
        if (message.data?.contractId === contractId) refetch();
      },
      [contractId, refetch],
    ),
  );

  if (!contract || !view || isLoading) return <LoadingScreen />;
  if (contract.tradeStatus === "rateUser") {
    return (
      <OverlayComponent>
        <TradeComplete contract={contract} />
      </OverlayComponent>
    );
  }

  return <ContractScreen contract={contract} view={view} />;
};

type ContractScreenProps = {
  contract: Contract;
  view: ContractViewer;
};

function ContractScreen({ contract, view }: ContractScreenProps) {
  const {
    data,
    isLoading: isLoadingPaymentData,
    isError,
  } = useDecryptedContractData(contract);
  const [showBatchInfo, toggleShowBatchInfo] = useToggleBoolean();

  if (isLoadingPaymentData) return <LoadingScreen />;

  return (
    <ContractContext.Provider
      value={{
        contract,
        paymentData: data?.paymentData,
        isDecryptionError: isError,
        view,
        showBatchInfo,
        toggleShowBatchInfo,
      }}
    >
      <Screen header={<ContractHeader />}>
        <PeachScrollView
          contentContainerStyle={tw`grow`}
          contentStyle={tw`grow`}
        >
          {showBatchInfo ? <PendingPayoutInfo /> : <TradeInformation />}
          <ContractActions />
        </PeachScrollView>
      </Screen>
    </ContractContext.Provider>
  );
}

function ContractHeader() {
  const { contract, view } = useContractContext();
  const {
    tradeStatus,
    disputeActive,
    canceled,
    disputeWinner,
    releaseTxId,
    batchInfo,
    amount,
    premium,
  } = contract;
  const requiredAction = getRequiredAction(contract);
  const setPopup = useSetPopup();
  const showConfirmPopup = useCallback(
    () =>
      setPopup(
        <ConfirmTradeCancelationPopup contract={contract} view={view} />,
      ),
    [contract, setPopup, view],
  );
  const showMakePaymentHelp = useCallback(
    () => setPopup(<HelpPopup id="makePayment" />),
    [setPopup],
  );
  const showConfirmPaymentHelp = useCallback(
    () => setPopup(<HelpPopup id="confirmPayment" />),
    [setPopup],
  );

  const memoizedIcons = useMemo(() => {
    const icons: HeaderIcon[] = [];
    if (disputeActive) return icons;

    if (canCancelContract(contract, view))
      icons.push({
        ...headerIcons.cancel,
        onPress: showConfirmPopup,
      });
    if (view === "buyer" && requiredAction === "sendPayment")
      icons.push({
        ...headerIcons.help,
        onPress: showMakePaymentHelp,
      });
    if (view === "seller" && requiredAction === "confirmPayment")
      icons.push({
        ...headerIcons.help,
        onPress: showConfirmPaymentHelp,
      });
    return icons;
  }, [
    contract,
    view,
    requiredAction,
    showMakePaymentHelp,
    showConfirmPaymentHelp,
    disputeActive,
    showConfirmPopup,
  ]);

  const theme = useMemo(() => {
    if (disputeActive || disputeWinner) return "dispute";
    if (canceled || tradeStatus === "confirmCancelation") return "cancel";
    if (isPaymentTooLate(contract)) return "paymentTooLate";
    return view;
  }, [canceled, contract, disputeActive, disputeWinner, tradeStatus, view]);

  const title = getHeaderTitle(view, contract);

  const isTradeCompleted =
    releaseTxId ||
    (batchInfo && batchInfo.completed) ||
    tradeStatus === "payoutPending";
  const { t } = useTranslate("contract");

  return (
    <Header
      icons={memoizedIcons}
      {...{ title, theme }}
      subtitle={
        <Header.Subtitle
          text={
            isTradeCompleted
              ? view === "buyer"
                ? t("contract.bought")
                : t("contract.sold")
              : undefined
          }
          viewer={view}
          {...{ amount, premium, theme }}
        />
      }
    />
  );
}

function getHeaderTitle(view: string, contract: Contract) {
  const {
    tradeStatus,
    disputeWinner,
    canceled,
    disputeActive,
    id: contractId,
  } = contract;
  if (view === "buyer") {
    if (disputeWinner === "buyer")
      return tolgee.t("contract.disputeWon", { ns: "contract" });
    if (disputeWinner === "seller")
      return tolgee.t("contract.disputeLost", { ns: "contract" });

    if (tradeStatus === "paymentRequired") {
      if (isPaymentTooLate(contract))
        return tolgee.t("contract.paymentTimerHasRunOut.title", {
          ns: "contract",
        });
      return tolgee.t("offer.requiredAction.paymentRequired", { ns: "offer" });
    }
    if (tradeStatus === "confirmPaymentRequired")
      return tolgee.t("offer.requiredAction.waiting.seller", { ns: "offer" });
    if (tradeStatus === "confirmCancelation")
      return tolgee.t("offer.requiredAction.confirmCancelation.buyer", {
        ns: "offer",
      });
  }

  if (view === "seller") {
    if (disputeWinner === "seller")
      return tolgee.t("contract.disputeWon", { ns: "contract" });
    if (disputeWinner === "buyer")
      return tolgee.t("contract.disputeLost", { ns: "contract" });
    if (canceled) return tolgee.t("contract.tradeCanceled", { ns: "contract" });
  }

  if (disputeActive)
    return tolgee.t("offer.requiredAction.dispute", { ns: "offer" });
  if (isPaymentTooLate(contract))
    return tolgee.t("contract.paymentTimerHasRunOut.title", { ns: "contract" });

  if (tradeStatus === "confirmCancelation")
    return tolgee.t("offer.requiredAction.confirmCancelation.seller", {
      ns: "offer",
    });
  if (tradeStatus === "paymentRequired")
    return tolgee.t("offer.requiredAction.waiting.buyer", { ns: "offer" });
  if (tradeStatus === "confirmPaymentRequired")
    return tolgee.t("offer.requiredAction.confirmPaymentRequired", {
      ns: "offer",
    });
  return contractIdToHex(contractId);
}
