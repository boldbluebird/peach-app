import { BuyOffer, SellOffer } from "../../../peach-api/src/@types/offer";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { queryClient } from "../../queryClient";
import { getSummaryFromOffer } from "./getSummaryFromOffer";

export const saveOffer = (offer: SellOffer | BuyOffer) => {
  queryClient.setQueryData(offerKeys.detail(offer.id), offer);
  queryClient.setQueryData(
    offerKeys.summaries(),
    (offers: (SellOffer | BuyOffer)[] | undefined = []) => {
      const storedOffer = offers.find(({ id }) => id === offer.id);
      if (storedOffer === undefined)
        return [...offers, getSummaryFromOffer(offer)];
      return offers.map((o) =>
        o.id === offer.id ? { ...o, ...getSummaryFromOffer(offer) } : o,
      );
    },
  );
};
