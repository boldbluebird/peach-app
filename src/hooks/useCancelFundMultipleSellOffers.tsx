import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useClosePopup, useSetPopup } from "../components/popup/Popup";
import { PopupAction } from "../components/popup/PopupAction";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../components/popup/actions/LoadingPopupAction";
import { GrayPopup } from "../popups/GrayPopup";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { peachAPI } from "../utils/peachAPI";
import { getError } from "../utils/result/getError";
import { getResult } from "../utils/result/getResult";
import { parseError } from "../utils/result/parseError";
import { FundMultipleInfo, useWalletState } from "../utils/wallet/walletStore";
import { useNavigation } from "./useNavigation";
import { useShowErrorBanner } from "./useShowErrorBanner";

type Props = {
  fundMultiple?: FundMultipleInfo;
};
export const useCancelFundMultipleSellOffers = ({ fundMultiple }: Props) => {
  const navigation = useNavigation();
  const showError = useShowErrorBanner();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const [registerFundMultiple, unregisterFundMultiple] = useWalletState(
    (state) => [state.registerFundMultiple, state.unregisterFundMultiple],
    shallow,
  );
  const showOfferCanceled = useCallback(() => {
    setPopup(
      <GrayPopup
        title={i18n("offer.canceled.popup.title")}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    );
  }, [setPopup]);

  const confirmCancelOffer = useCallback(async () => {
    if (!fundMultiple) return;

    const results = await Promise.all(
      fundMultiple.offerIds?.map(async (offerId) => {
        const { result: cancelResult, error: cancelError } =
          await peachAPI.private.offer.cancelOffer({ offerId });
        if (cancelError) return getError(cancelError?.error);
        if (!cancelResult) return getError(null);
        return getResult(cancelResult);
      }),
    );

    const notCanceledOffers = fundMultiple.offerIds.filter((offerId, i) =>
      results[i].isError(),
    );
    const error = results.find((result) => result.isError());
    const errorMessage = error?.isError() ? error.getError() : undefined;

    if (notCanceledOffers.length > 0) {
      registerFundMultiple(fundMultiple.address, notCanceledOffers);
    } else {
      unregisterFundMultiple(fundMultiple.address);
    }

    if (errorMessage) {
      showError(parseError(errorMessage));
    }
    showOfferCanceled();
    navigation.replace("homeScreen", { screen: "home" });
  }, [
    fundMultiple,
    navigation,
    registerFundMultiple,
    showError,
    showOfferCanceled,
    unregisterFundMultiple,
  ]);

  const showCancelSellOffersPopup = useCallback(() => {
    setPopup(
      <GrayPopup
        title={i18n("offer.cancel.popup.title")}
        content={i18n("offer.cancel.popup.description")}
        actions={
          <>
            <PopupAction
              label={i18n("neverMind")}
              iconId="arrowLeftCircle"
              onPress={closePopup}
            />
            <LoadingPopupAction
              label={i18n("cancelOffer")}
              iconId="xCircle"
              onPress={confirmCancelOffer}
              reverseOrder
            />
          </>
        }
      />,
    );
  }, [closePopup, confirmCancelOffer, setPopup]);

  return showCancelSellOffersPopup;
};
