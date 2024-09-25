import { TradeStatus } from "../../../../peach-api/src/@types/offer";
import { IconType } from "../../../assets/icons";

export const statusIcons: Record<TradeStatus | "waiting", IconType> = {
  fundEscrow: "uploadCloud",
  fundingExpired: "watch",
  waitingForFunding: "uploadCloud",
  searchingForPeer: "search",
  offerHidden: "eyeOff",
  offerHiddenWithMatchesAvailable: "checkCircle",
  fundingAmountDifferent: "uploadCloud",
  escrowWaitingForConfirmation: "clock",
  hasMatchesAvailable: "checkCircle",
  refundAddressRequired: "edit",
  refundTxSignatureRequired: "rotateCounterClockwise",
  paymentRequired: "dollarSign",
  paymentTooLate: "watch",
  confirmPaymentRequired: "dollarSign",
  payoutPending: "clock",
  dispute: "alertOctagon",
  releaseEscrow: "upload",
  rateUser: "heart",
  confirmCancelation: "xCircle",
  waiting: "dollarSign",
  offerCanceled: "crossOutlined",
  tradeCanceled: "crossOutlined",
  refundOrReviveRequired: "crossOutlined",
  tradeCompleted: "checkCircle",
};
