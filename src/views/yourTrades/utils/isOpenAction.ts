import { TradeStatus } from "../../../../peach-api/src/@types/offer";

const openActionStatus = [
  "fundEscrow",
  "fundingAmountDifferent",
  "hasMatchesAvailable",
  "offerHiddenWithMatchesAvailable",
  "rateUser",
];
const sellOpenActionStatus = ["confirmPaymentRequired", "paymentTooLate"];
const buyOpenActionStatus = ["paymentRequired", "fundingExpired"];

export const isOpenAction = (type: "ask" | "bid", tradeStatus: TradeStatus) =>
  openActionStatus.includes(tradeStatus) ||
  (sellOpenActionStatus.includes(tradeStatus) && type === "ask") ||
  (buyOpenActionStatus.includes(tradeStatus) && type === "bid");
