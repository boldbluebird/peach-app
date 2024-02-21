import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { signReleaseTxOfContract } from "../../../utils/contract/signReleaseTxOfContract";
import { peachAPI } from "../../../utils/peachAPI";

export const useReleaseEscrow = (contract: Contract) => {
  const showError = useShowErrorBanner();

  const queryClient = useQueryClient();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["contract", contract.id] });
      const previousData = queryClient.getQueryData<Contract>([
        "contract",
        contract.id,
      ]);
      queryClient.setQueryData(
        ["contract", contract.id],
        (old: Contract | undefined) => {
          if (!old) return old;
          return {
            ...old,
            paymentConfirmed: new Date(),
            releaseTxId: "",
            disputeResolvedDate: new Date(),
          };
        },
      );
      return { previousData };
    },
    mutationFn: async () => {
      const { result, error } = signReleaseTxOfContract(contract);
      if (!result?.releaseTransaction) {
        throw new Error(error);
      }

      const { error: err } =
        await peachAPI.private.contract.confirmPaymentSeller({
          contractId: contract.id,
          releaseTransaction: result.releaseTransaction,
          batchReleasePsbt: result.batchReleasePsbt,
        });
      if (err) {
        throw new Error(err.error);
      }
    },
    onError: (err: string | undefined, _variables, context) => {
      queryClient.setQueryData(
        ["contract", contract.id],
        context?.previousData,
      );
      showError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", contract.id] });
    },
  });
};
