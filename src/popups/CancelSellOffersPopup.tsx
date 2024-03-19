import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useClosePopup, useSetPopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../components/popup/actions/LoadingPopupAction";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import { parseError } from "../utils/parseError";
import { FundMultipleInfo, useWalletState } from "../utils/wallet/walletStore";
import { GrayPopup } from "./GrayPopup";
import { useCancelOffer } from "./useCancelOffer";
import { useTranslate } from "@tolgee/react";

type Props = {
  fundMultiple?: FundMultipleInfo;
};

export function CancelSellOffersPopup({ fundMultiple }: Props) {
  const navigation = useStackNavigation();
  const showError = useShowErrorBanner();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const [registerFundMultiple, unregisterFundMultiple] = useWalletState(
    (state) => [state.registerFundMultiple, state.unregisterFundMultiple],
    shallow,
  );
  const { t } = useTranslate();
  const showOfferCanceled = useCallback(() => {
    setPopup(
      <GrayPopup
        title={t("offer.canceled.popup.title")}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    );
  }, [setPopup, t]);

  const { mutateAsync: cancelOffer, isPending } = useCancelOffer();

  const confirmCancelOffer = async () => {
    if (!fundMultiple) return;

    const results = await Promise.all(
      fundMultiple.offerIds.map(async (offerId) => {
        try {
          const result = await cancelOffer(offerId);
          return result;
        } catch (error) {
          return offerId;
        }
      }),
    );

    const notCanceledOffers = results.filter(
      (result): result is string => typeof result === "string",
    );

    if (notCanceledOffers.length > 0) {
      registerFundMultiple(fundMultiple.address, notCanceledOffers);
    } else {
      unregisterFundMultiple(fundMultiple.address);
    }

    if (notCanceledOffers.length > 0) {
      showError(parseError({ error: "CANCEL_OFFER_ERROR" }));
    }
    if (notCanceledOffers.length < fundMultiple.offerIds.length) {
      showOfferCanceled();
      navigation.navigate("homeScreen", { screen: "home" });
    }
  };

  return (
    <GrayPopup
      title={t("offer.cancel.popup.title", { ns: "offer" })}
      content={t("offer.cancel.popup.description", { ns: "offer" })}
      actions={
        <>
          <PopupAction
            label={t({ key: "neverMind" })}
            iconId="arrowLeftCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
            label={t({ key: "cancelOffer" })}
            iconId="xCircle"
            onPress={confirmCancelOffer}
            loading={isPending}
            reverseOrder
          />
        </>
      }
    />
  );
}
