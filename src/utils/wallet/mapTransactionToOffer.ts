import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { ContractSummary } from "../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../peach-api/src/@types/offer";
import { getBuyOfferIdFromContract } from "../contract/getBuyOfferIdFromContract";
import { useWalletState } from "./walletStore";

export function mapTransactionToOffer({
  offerSummaries,
  contractSummaries,
}: {
  offerSummaries: Pick<OfferSummary, "txId" | "fundingTxId" | "id">[];
  contractSummaries: Pick<ContractSummary, "releaseTxId" | "id">[];
}) {
  return ({ txid }: TransactionDetails) => {
    const sellOffers = offerSummaries.filter(
      (offer) => offer.txId === txid || offer.fundingTxId === txid,
    );
    if (sellOffers.length) {
      useWalletState.getState().updateTxOfferMap(
        txid,
        sellOffers.map(({ id }) => id),
      );
      return;
    }

    const filteredContracts = contractSummaries.filter(
      (contract) => contract.releaseTxId === txid,
    );
    if (filteredContracts.length) {
      useWalletState
        .getState()
        .updateTxOfferMap(
          txid,
          filteredContracts.map(getBuyOfferIdFromContract),
        );
    }
  };
}
